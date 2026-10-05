import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { renderCardCanvas } from './card-canvas';

@Injectable({ providedIn: 'root' })
export class VisitingCardPdfService {
  async download(front: HTMLElement, back: HTMLElement, filename: string): Promise<void> {
    const [frontCanvas, backCanvas] = await Promise.all([
      renderCardCanvas(front),
      renderCardCanvas(back),
    ]);
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'in',
      format: [3.5, 2],
      compress: true,
    });

    pdf.addImage(frontCanvas.toDataURL('image/png'), 'PNG', 0, 0, 3.5, 2, undefined, 'FAST');
    pdf.addPage([3.5, 2], 'landscape');
    pdf.addImage(backCanvas.toDataURL('image/png'), 'PNG', 0, 0, 3.5, 2, undefined, 'FAST');
    pdf.save(filename);
  }
}
