import { ChangeDetectionStrategy, Component, computed, inject, signal, viewChild } from '@angular/core';
import { DownloadActionsComponent } from '../components/download-actions/download-actions.component';
import { VisitingCardFormComponent } from '../components/visiting-card-form/visiting-card-form.component';
import { VisitingCardPreviewComponent } from '../components/visiting-card-preview/visiting-card-preview.component';
import { VisitingCardImageService } from '../services/visiting-card-image.service';
import { VisitingCardPdfService } from '../services/visiting-card-pdf.service';
import { VisitingCardModel } from '../models/visiting-card.model';

const initialCard: VisitingCardModel = {
  name: '',
  mobile: '',
  email: '',
  role: null,
  companyName: 'SysTrans Technologies',
  logo: '',
  address: '',
  website: 'https://www.systranstechnologies.com',
  linkedin: '',
};

@Component({
  selector: 'app-visiting-card-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VisitingCardFormComponent, VisitingCardPreviewComponent, DownloadActionsComponent],
  templateUrl: './visiting-card-page.component.html',
  styleUrl: './visiting-card-page.component.scss',
})
export class VisitingCardPageComponent {
  private readonly pdfService = inject(VisitingCardPdfService);
  private readonly imageService = inject(VisitingCardImageService);
  private readonly preview = viewChild.required(VisitingCardPreviewComponent);

  protected readonly card = signal<VisitingCardModel>(initialCard);
  protected readonly generated = signal(false);
  protected readonly activeDownload = signal<'pdf' | 'png' | null>(null);
  protected readonly exportError = signal<string | null>(null);
  protected readonly exportBusy = computed(() => this.activeDownload() !== null);

  protected updateCard(card: VisitingCardModel): void {
    this.card.set(card);
  }

  protected generateCard(): void {
    this.generated.set(true);
    this.exportError.set(null);
  }

  protected async downloadPdf(): Promise<void> {
    const { frontCard, backCard } = this.preview();
    await this.download('pdf', () =>
      this.pdfService.download(
        frontCard().nativeElement,
        backCard().nativeElement,
        `${this.filenameName()}_VisitingCard.pdf`,
      ),
    );
  }

  protected async downloadPng(): Promise<void> {
    const { frontCard } = this.preview();
    await this.download('png', () =>
      this.imageService.download(
        frontCard().nativeElement,
        `${this.filenameName()}_VisitingCard.png`,
      ),
    );
  }

  private filenameName(): string {
    const name = this.card()
      .name.normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '');
    return name || 'Employee';
  }

  private async download(kind: 'pdf' | 'png', action: () => Promise<void>): Promise<void> {
    if (this.activeDownload()) {
      return;
    }

    this.activeDownload.set(kind);
    this.exportError.set(null);

    try {
      await action();
    } catch {
      this.exportError.set(`Your ${kind.toUpperCase()} could not be generated. Please try again.`);
    } finally {
      this.activeDownload.set(null);
    }
  }
}
