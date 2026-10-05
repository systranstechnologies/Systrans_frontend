import { ChangeDetectionStrategy, Component, DestroyRef, inject, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { startWith } from 'rxjs';
import { EmployeeRole } from '../../enums/employee-role.enum';
import { VisitingCardModel } from '../../models/visiting-card.model';
import { sanitizeSvg, validateLogoFile } from '../../validators/image-file.validator';

type VisitingCardFormControls = {
  name: FormControl<string>;
  mobile: FormControl<string>;
  email: FormControl<string>;
  role: FormControl<EmployeeRole | null>;
  companyName: FormControl<string>;
  logo: FormControl<string>;
  address: FormControl<string>;
  website: FormControl<string>;
  linkedin: FormControl<string>;
};

const websitePattern = /^https?:\/\/[^\s.]+(?:\.[^\s.]+)+(?:[/?#][^\s]*)?$/i;

@Component({
  selector: 'app-visiting-card-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './visiting-card-form.component.html',
  styleUrl: './visiting-card-form.component.scss',
})
export class VisitingCardFormComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly cardChange = output<VisitingCardModel>();
  readonly generate = output<void>();
  protected readonly EmployeeRole = EmployeeRole;
  protected readonly logoError = signal<string | null>(null);
  protected readonly logoPreview = signal<string | null>(null);
  protected readonly form: FormGroup<VisitingCardFormControls> = new FormGroup({
    name: this.formBuilder.control('', [Validators.required, Validators.minLength(3)]),
    mobile: this.formBuilder.control('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
    email: this.formBuilder.control('', [Validators.required, Validators.email]),
    role: new FormControl<EmployeeRole | null>(null, Validators.required),
    companyName: this.formBuilder.control({ value: 'SysTrans Technologies', disabled: true }),
    logo: this.formBuilder.control('', Validators.required),
    address: this.formBuilder.control('', Validators.required),
    website: this.formBuilder.control('https://www.systranstechnologies.com', Validators.pattern(websitePattern)),
    linkedin: this.formBuilder.control('', Validators.pattern(websitePattern)),
  });

  constructor() {
    this.form.valueChanges
      .pipe(startWith(this.form.getRawValue()), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.cardChange.emit(this.form.getRawValue()));
  }

  protected hasError(field: keyof VisitingCardFormControls, error: string): boolean {
    const control = this.form.controls[field];
    return control.hasError(error) && (control.touched || control.dirty);
  }

  protected async onLogoSelected(event: Event): Promise<void> {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    const file = input.files?.[0];
    this.logoError.set(null);

    if (!file) {
      return;
    }

    const fileError = validateLogoFile(file);
    if (fileError) {
      this.setLogoError(
        fileError === 'size'
          ? 'Choose an image smaller than 5 MB.'
          : 'Choose a PNG, JPG, JPEG, or SVG image.',
      );
      input.value = '';
      return;
    }
    try {
      if (file.name.toLowerCase().endsWith('.svg')) {
        const safeSvg = sanitizeSvg(await file.text());
        if (!safeSvg) {
          this.setLogoError('This SVG file could not be safely displayed. Choose another image.');
          input.value = '';
          return;
        }

        this.setLogoData(`data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(safeSvg)))}`);
        return;
      }

      this.setLogoData(await this.readAsDataUrl(file));
    } catch {
      this.setLogoError('The selected image could not be read. Please choose another file.');
      input.value = '';
    }
  }

  protected submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.generate.emit();
  }

  private setLogoData(dataUrl: string): void {
    this.logoPreview.set(dataUrl);
    this.form.controls.logo.setValue(dataUrl);
    this.form.controls.logo.markAsDirty();
  }

  private setLogoError(message: string): void {
    this.logoError.set(message);
    this.logoPreview.set(null);
    this.form.controls.logo.setValue('');
    this.form.controls.logo.markAsTouched();
  }

  private readAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () =>
        typeof reader.result === 'string'
          ? resolve(reader.result)
          : reject(new Error('The selected image could not be read.'));
      reader.onerror = () => reject(new Error('The selected image could not be read.'));
      reader.readAsDataURL(file);
    });
  }
}
