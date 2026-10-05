import { Injectable } from '@angular/core';
import { renderCardCanvas } from './card-canvas';

@Injectable({ providedIn: 'root' })
export class VisitingCardImageService {
  async download(front: HTMLElement, filename: string): Promise<void> {
    const canvas = await renderCardCanvas(front);
    const image = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('The visiting card image could not be created.'));
        }
      }, 'image/png');
    });
    const downloadUrl = URL.createObjectURL(image);
    const anchor = document.createElement('a');

    anchor.href = downloadUrl;
    anchor.download = filename;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
  }
}
