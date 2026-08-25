const PDFDocument = require('pdfkit');

/**
 * Generates an official-looking academic transcript / GPA summary report as a PDF stream.
 *
 * @param {Object} data - GPA calculation details, student details, semester information
 * @param {import('stream').Writable} outputStream - Stream to write PDF to
 */
function generateTranscriptPdf(data, outputStream) {
  const doc = new PDFDocument({
    margin: 40,
    size: 'A4',
    info: {
      Title: `GPAFlow Academic Transcript - ${data.semesterName || 'Semester'}`,
      Author: 'GPAFlow GPA Calculator',
      Subject: 'Official Academic Calculation Summary'
    }
  });

  doc.pipe(outputStream);

  // Colors
  const primaryColor = '#4f46e5'; // Indigo 600
  const secondaryColor = '#06b6d4'; // Cyan 500
  const textColor = '#1e293b'; // Slate 800
  const lightBg = '#f8fafc'; // Slate 50
  const borderColor = '#e2e8f0'; // Slate 200

  // 1. Header Banner
  doc.rect(40, 40, 515, 60).fill('#1e1b4b'); // Deep indigo dark
  doc.fillColor('#ffffff').fontSize(20).font('Helvetica-Bold').text('GPAFlow Academic Report', 60, 55);
  doc.fillColor('#a5b4fc').fontSize(10).font('Helvetica').text('Official Semester Grade & GPA Computation Transcript', 60, 78);
  doc.fillColor('#ffffff').fontSize(11).font('Helvetica-Bold').text('VERIFIED REPORT', 420, 62, { align: 'right' });

  // 2. Metadata / Student Details Box
  doc.rect(40, 115, 515, 75).fill(lightBg).stroke(borderColor);
  
  doc.fillColor(textColor).fontSize(10).font('Helvetica-Bold').text('Student / Report Details', 55, 125);
  doc.font('Helvetica').fontSize(9).fillColor('#475569');
  
  doc.text(`Student Name: ${data.studentName || 'Student'}`, 55, 142);
  doc.text(`Institution / University: ${data.institution || 'University Academic Department'}`, 55, 156);
  doc.text(`Report Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 55, 170);

  doc.text(`Semester Term: ${data.semesterName || 'Current Semester'}`, 320, 142);
  doc.text(`Grading Scale: ${data.scaleName || 'Standard US 4.0 Scale'}`, 320, 156);
  doc.text(`Academic Standing: ${data.academicStanding || 'Good Standing'}`, 320, 170);

  // 3. Courses Table Header
  const tableTop = 210;
  doc.rect(40, tableTop, 515, 24).fill('#4f46e5');
  doc.fillColor('#ffffff').fontSize(9).font('Helvetica-Bold');
  doc.text('#', 55, tableTop + 7);
  doc.text('Course / Subject Title', 85, tableTop + 7);
  doc.text('Credits', 300, tableTop + 7, { width: 70, align: 'center' });
  doc.text('Grade', 380, tableTop + 7, { width: 60, align: 'center' });
  doc.text('Grade Points', 445, tableTop + 7, { width: 50, align: 'center' });
  doc.text('Quality Pts', 500, tableTop + 7, { width: 50, align: 'right' });

  // 4. Course Rows
  let currentY = tableTop + 24;
  const courses = data.courses || [];

  courses.forEach((c, index) => {
    const isEven = index % 2 === 0;
    if (isEven) {
      doc.rect(40, currentY, 515, 20).fill('#f1f5f9');
    }

    doc.fillColor(textColor).fontSize(9).font('Helvetica');
    doc.text(`${index + 1}`, 55, currentY + 5);
    doc.text(c.name || `Course ${index + 1}`, 85, currentY + 5, { width: 210, lineBreak: false });
    doc.text(`${c.credits}`, 300, currentY + 5, { width: 70, align: 'center' });
    doc.font('Helvetica-Bold').text(`${c.grade}`, 380, currentY + 5, { width: 60, align: 'center' });
    doc.font('Helvetica').text(`${c.points}`, 445, currentY + 5, { width: 50, align: 'center' });
    doc.text(`${c.qualityPoints}`, 500, currentY + 5, { width: 50, align: 'right' });

    currentY += 20;
  });

  // Bottom line of table
  doc.rect(40, currentY, 515, 1).fill(borderColor);
  currentY += 15;

  // 5. Summary Hero Card & Cumulative Section
  const summaryBoxY = currentY;
  const summaryBoxHeight = data.cumulative ? 130 : 95;

  doc.rect(40, summaryBoxY, 515, summaryBoxHeight).fill('#f8fafc').stroke(primaryColor);
  
  // Left side: Semester Highlights
  doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold').text('Semester Summary', 60, summaryBoxY + 15);
  doc.fillColor(textColor).fontSize(9).font('Helvetica');
  doc.text(`Total Semester Credits: `, 60, summaryBoxY + 35);
  doc.font('Helvetica-Bold').text(`${data.totalCredits}`, 180, summaryBoxY + 35);
  
  doc.font('Helvetica').text(`Total Quality Points: `, 60, summaryBoxY + 50);
  doc.font('Helvetica-Bold').text(`${data.totalQualityPoints}`, 180, summaryBoxY + 50);

  doc.font('Helvetica').text(`Academic Standing: `, 60, summaryBoxY + 65);
  doc.font('Helvetica-Bold').fillColor('#059669').text(`${data.academicStanding || 'Good Standing'}`, 180, summaryBoxY + 65);

  // Big GPA Callout
  doc.rect(400, summaryBoxY + 15, 135, 65).fill('#e0e7ff').stroke('#818cf8');
  doc.fillColor('#3730a3').fontSize(9).font('Helvetica-Bold').text('SEMESTER GPA', 400, summaryBoxY + 22, { width: 135, align: 'center' });
  doc.fillColor('#4338ca').fontSize(26).font('Helvetica-Bold').text(`${Number(data.semesterGpa).toFixed(2)}`, 400, summaryBoxY + 38, { width: 135, align: 'center' });
  doc.fillColor('#6366f1').fontSize(8).font('Helvetica').text(`/ ${data.maxGpa || 4.0}`, 400, summaryBoxY + 66, { width: 135, align: 'center' });

  // Cumulative section if available
  if (data.cumulative) {
    doc.rect(55, summaryBoxY + 85, 485, 1).fill('#cbd5e1');
    doc.fillColor(primaryColor).fontSize(10).font('Helvetica-Bold').text('Cumulative Career Highlights', 60, summaryBoxY + 95);
    doc.font('Helvetica').fontSize(9).fillColor(textColor);
    doc.text(`Prior Credits: ${data.cumulative.previousCredits} | Prior GPA: ${data.cumulative.previousGpa}`, 60, summaryBoxY + 110);
    doc.font('Helvetica-Bold').fillColor('#4338ca').text(`Updated Cumulative GPA: ${data.cumulative.newCumulativeGpa} (Total Credits: ${data.cumulative.newTotalCredits})`, 270, summaryBoxY + 110);
  }

  // 6. Footer & Certification Notice
  const footerY = 750;
  doc.rect(40, footerY - 10, 515, 1).fill(borderColor);
  doc.fillColor('#94a3b8').fontSize(8).font('Helvetica').text(
    'Generated by GPAFlow — Modern Academic GPA & CGPA Engine. This calculation was generated based on user provided grades and credit mappings.',
    40,
    footerY,
    { width: 515, align: 'center' }
  );

  doc.end();
}

module.exports = { generateTranscriptPdf };
