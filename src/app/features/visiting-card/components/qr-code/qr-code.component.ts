import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';
import QRCode from 'qrcode';

@Component({
  selector: 'app-qr-code',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (qrData(); as image) {
      <img class="qr-image" [src]="image" alt="QR code linking to the SysTrans Technologies website" />
    } @else if (error()) {
      <span class="qr-error" role="status">QR code unavailable</span>
    } @else {
      <span class="qr-loading" role="status">Generating QR code…</span>
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      width: 4.5rem;
      height: 4.5rem;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border-radius: 0.45rem;
      background: #fff;
      padding: 0.2rem;
    }

    .qr-image {
      display: block;
      width: 100%;
      height: 100%;
      image-rendering: pixelated;
    }

    .qr-error,
    .qr-loading {
      color: #364963;
      font: 0.5rem/1.2 Arial, sans-serif;
      text-align: center;
    }
  `,
})
export class QrCodeComponent {
  readonly url = input.required<string>();
  protected readonly qrData = signal<string | null>(null);
  protected readonly error = signal(false);

  constructor() {
    effect(() => {
      const value = this.url();
      this.qrData.set(null);
      this.error.set(false);

      void QRCode.toDataURL(value, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 220,
        color: { dark: '#0A2D68', light: '#FFFFFF' },
      }).then(
        (image) => this.qrData.set(image),
        () => this.error.set(true),
      );
    });
  }
}
