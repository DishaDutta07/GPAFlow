const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');
const path = require('path');

const dir = process.cwd();

async function setupGit() {
  console.log('1. Initializing Git repository...');
  await git.init({ fs, dir, defaultBranch: 'main' });

  console.log('2. Setting up remote...');
  try {
    await git.addRemote({
      fs,
      dir,
      remote: 'origin',
      url: 'https://github.com/DishaDutta07/GPAFlow.git',
      force: true
    });
  } catch (err) {
    console.log('Remote note:', err.message);
  }

  console.log('3. Staging files...');
  // Read gitignore and stage all non-ignored files
  const statusMatrix = await git.statusMatrix({ fs, dir });
  
  for (const [filepath, head, workdir, stage] of statusMatrix) {
    if (workdir !== 0) {
      await git.add({ fs, dir, filepath });
    }
  }

  console.log('4. Creating commit...');
  try {
    const sha = await git.commit({
      fs,
      dir,
      author: {
        name: 'Disha Dutta',
        email: 'dishadutta@users.noreply.github.com'
      },
      message: 'feat: GPAFlow modern mobile GPA & CGPA web application'
    });
    console.log('✅ Commit created successfully! SHA:', sha);
  } catch (err) {
    console.log('Commit note:', err.message);
  }

  console.log('5. Current branch:');
  const currentBranch = await git.currentBranch({ fs, dir });
  console.log('Branch:', currentBranch);
}

setupGit().catch(console.error);
