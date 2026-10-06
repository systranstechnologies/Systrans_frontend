import { ChangeDetectionStrategy, Component, computed, input, viewChild, ElementRef } from '@angular/core';
import { QrCodeComponent } from '../qr-code/qr-code.component';
import { EmployeeRole } from '../../enums/employee-role.enum';
import { VisitingCardModel } from '../../models/visiting-card.model';

const roleDisplayNames: Record<EmployeeRole, string> = {
  [EmployeeRole.CeoFounder]: 'Founder & CEO',
  [EmployeeRole.Director]: 'Director',
  [EmployeeRole.Manager]: 'Manager',
  [EmployeeRole.SalesHead]: 'Sales Head',
  [EmployeeRole.ProductHead]: 'Product Head',
  [EmployeeRole.Employee]: 'Employee',
};

@Component({
  selector: 'app-visiting-card-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [QrCodeComponent],
  templateUrl: './visiting-card-preview.component.html',
  styleUrl: './visiting-card-preview.component.scss',
})
export class VisitingCardPreviewComponent {
  readonly card = input.required<VisitingCardModel>();
  readonly frontCard = viewChild.required<ElementRef<HTMLElement>>('frontCard');
  readonly backCard = viewChild.required<ElementRef<HTMLElement>>('backCard');
  protected readonly displayRole = computed(() => {
    const role = this.card().role;
    return role ? roleDisplayNames[role] : '';
  });
  protected readonly siteUrl = 'https://systranstechnologies.netlify.app';
  protected readonly services = [
    'Software & Web Apps',
    'Mobile Apps',
    'Enterprise Solutions',
    'Cloud & Digital Transformation',
  ];
}
