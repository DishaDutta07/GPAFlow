const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');

const dir = process.cwd();
const token = process.env.GITHUB_TOKEN || process.argv[2];

async function pushToGitHub() {
  if (!token) {
    console.log('---------------------------------------------------------');
    console.log('🔑 GitHub Authentication Required to push to remote:');
    console.log('');
    console.log('Option A: Run with your GitHub Personal Access Token (PAT):');
    console.log('   node git-push.js YOUR_GITHUB_TOKEN');
    console.log('');
    console.log('Option B: If you have Git installed on your machine:');
    console.log('   git push -u origin main');
    console.log('---------------------------------------------------------');
    process.exit(1);
  }

  console.log('🚀 Pushing to https://github.com/DishaDutta07/GPAFlow.git on branch main...');
  try {
    const pushResult = await git.push({
      fs,
      http,
      dir,
      remote: 'origin',
      ref: 'main',
      onAuth: () => ({ username: token }),
      force: false
    });
    console.log('✅ Successfully pushed to GitHub!', pushResult);
  } catch (err) {
    console.error('❌ Push error:', err.message);
    if (err.message.includes('401') || err.message.includes('403') || err.message.includes('Authentication')) {
      console.log('💡 Tip: Ensure your GitHub token has "repo" permissions enabled.');
    }
  }
}

pushToGitHub().catch(console.error);
