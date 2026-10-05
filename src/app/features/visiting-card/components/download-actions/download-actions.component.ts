import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-download-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './download-actions.component.html',
  styleUrl: './download-actions.component.scss',
})
export class DownloadActionsComponent {
  readonly enabled = input(false);
  readonly busy = input(false);
  readonly downloadPdf = output<void>();
  readonly downloadPng = output<void>();
}
