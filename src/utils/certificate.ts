import { jsPDF } from 'jspdf';

export const generateCertificatePDF = (userName: string, courseName: string): string => {
  // Crear un nuevo documento PDF
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Configurar el fondo
  doc.setFillColor(249, 250, 251); // bg-gray-50
  doc.rect(0, 0, 297, 210, 'F');

  // Agregar borde decorativo
  doc.setDrawColor(79, 70, 229); // indigo-600
  doc.setLineWidth(2);
  doc.roundedRect(10, 10, 277, 190, 3, 3);

  // Agregar diseño decorativo
  doc.setFillColor(79, 70, 229, 0.1); // indigo-600 con opacidad
  doc.circle(20, 20, 40, 'F');
  doc.circle(277, 190, 40, 'F');

  // Título principal
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 41, 55); // text-gray-800
  doc.setFontSize(40);
  doc.text('CERTIFICADO', 148.5, 50, { align: 'center' });
  doc.setFontSize(20);
  doc.text('DE FINALIZACIÓN', 148.5, 65, { align: 'center' });

  // Línea decorativa
  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(0.5);
  doc.line(98.5, 70, 198.5, 70);

  // Texto de otorgamiento
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(16);
  doc.setTextColor(55, 65, 81); // text-gray-700
  doc.text('Este certificado se otorga a:', 148.5, 90, { align: 'center' });

  // Nombre del estudiante
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(79, 70, 229); // indigo-600
  doc.text(userName, 148.5, 110, { align: 'center' });

  // Texto de completitud
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(16);
  doc.setTextColor(55, 65, 81);
  doc.text('Por haber completado exitosamente el curso:', 148.5, 130, { align: 'center' });

  // Nombre del curso
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(79, 70, 229);
  doc.text(courseName, 148.5, 150, { align: 'center' });

  // Fecha
  const fecha = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(107, 114, 128); // text-gray-500
  doc.text(`Fecha de emisión: ${fecha}`, 148.5, 170, { align: 'center' });

  // Firma
  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(0.5);
  doc.line(98.5, 185, 198.5, 185);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text('Director Académico', 148.5, 190, { align: 'center' });

  // Generar URL del PDF
  const pdfBlob = doc.output('blob');
  return URL.createObjectURL(pdfBlob);
};