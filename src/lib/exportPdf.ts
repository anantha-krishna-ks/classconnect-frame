import jsPDF from "jspdf";

export function exportQuestionsToPDF(questions, paperName = "Question Paper") {
  const doc = new jsPDF();
  let y = 20;
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(16);
  doc.text(paperName, 10, y);
  y += 12;
  doc.setFontSize(12);
  doc.text(`Total Questions: ${questions.length}`, 10, y);
  y += 10;
  questions.forEach((q, idx) => {
    // Add question number and text, handle \n as real newlines
    let text = `${idx + 1}. ${(q.questiontext || q.text || "").replace(/\\n|\n/g, "\n")}`;
    // Split long questions into lines
    const lines = doc.splitTextToSize(text, 180);
    doc.text(lines, 10, y);
    y += lines.length * 7;

    // Add options if present (MCQ)
    if (q.options && q.options.length > 0) {
      q.options.forEach((opt, i) => {
        // Add option label (a), (b), ...
        const label = String.fromCharCode(97 + i);
        const optText = `(${label}) ${opt.replace(/\\n|\n/g, "\n")}`;
        const optLines = doc.splitTextToSize(optText, 170);
        doc.text(optLines, 16, y);
        y += optLines.length * 7;
      });
    }

    // Add answer if present
    if (q.answer) {
      doc.setFont('helvetica', 'italic');
      doc.text(`Answer: ${q.answer}`, 12, y);
      doc.setFont('helvetica', 'normal');
      y += 7;
    }

    // Add taxonomy and type if present
    if (q.taxonomy || q.questiontype) {
      let meta = [];
      if (q.taxonomy) meta.push(`Taxonomy: ${q.taxonomy}`);
      if (q.questiontype) meta.push(`Type: ${q.questiontype}`);
      doc.setFontSize(10);
      doc.text(meta.join(' | '), 12, y);
      doc.setFontSize(12);
      y += 6;
    }

    // Add space after each question
    y += 6;
    // Add page if needed
    if (y > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }
  });

  // Add footer with export date
  const date = new Date();
  doc.setFontSize(9);
  doc.text(`Exported on: ${date.toLocaleString()}`, 10, pageHeight - 8);

  doc.save(`${paperName.replace(/\s+/g, "_")}.pdf`);
}
