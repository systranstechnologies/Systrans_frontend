import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { JobsService, NewJob } from '../shared/jobs.service';

@Component({
  selector: 'app-add-systrans-job-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-systrans-job-page.html',
})
export class AddSysTransJobPage implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly jobsService = inject(JobsService);
  private readonly router = inject(Router);

  protected readonly authenticated = signal(false);
  protected readonly checkingSession = signal(true);
  protected readonly busy = signal(false);
  protected readonly error = signal('');
  protected readonly loginForm = this.formBuilder.nonNullable.group({
    password: ['', Validators.required],
  });
  protected readonly jobForm = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    department: ['', [Validators.required, Validators.maxLength(100)]],
    location: ['', [Validators.required, Validators.maxLength(160)]],
    employmentType: ['', Validators.required],
    workplaceType: ['', Validators.required],
    experienceLevel: ['', [Validators.required, Validators.maxLength(100)]],
    salaryRange: ['', Validators.maxLength(160)],
    summary: ['', [Validators.required, Validators.maxLength(1000)]],
    description: ['', Validators.required],
    responsibilities: [''],
    requirements: ['', Validators.required],
    benefits: [''],
    applicationEmail: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    applicationUrl: ['', Validators.maxLength(2048)],
    closingDate: [''],
  });

  ngOnInit(): void {
    this.jobsService.isAdmin().subscribe({
      next: ({ authenticated }) => {
        this.authenticated.set(authenticated);
        this.checkingSession.set(false);
      },
      error: () => {
        this.error.set('The job service is unavailable. Please try again later.');
        this.checkingSession.set(false);
      },
    });
  }

  protected login(): void {
    if (this.loginForm.invalid || this.busy()) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.busy.set(true);
    this.error.set('');
    this.jobsService.login(this.loginForm.getRawValue().password).subscribe({
      next: () => {
        this.authenticated.set(true);
        this.busy.set(false);
        this.loginForm.reset();
      },
      error: (error: { status?: number; message?: string }) => {
        this.error.set(
          error.status === 401
            ? 'The admin password is incorrect.'
            : error.message?.includes('session token')
              ? error.message
              : 'Sign-in failed. Please try again.',
        );
        this.busy.set(false);
      },
    });
  }

  protected saveJob(): void {
    if (this.jobForm.invalid || this.busy()) {
      this.jobForm.markAllAsTouched();
      return;
    }
    this.busy.set(true);
    this.error.set('');
    const formValue = this.jobForm.getRawValue();
    const job: NewJob = {
      ...formValue,
      salaryRange: formValue.salaryRange || null,
      responsibilities: formValue.responsibilities || null,
      benefits: formValue.benefits || null,
      applicationUrl: formValue.applicationUrl || null,
      closingDate: formValue.closingDate || null,
    };
    this.jobsService.create(job).subscribe({
      next: () => {
        void this.router.navigate(['/careers']);
      },
      error: (error: { status?: number }) => {
        if (error.status === 401) {
          this.authenticated.set(false);
          this.error.set('Your admin session has expired. Please sign in again.');
        } else {
          this.error.set('The vacancy could not be saved. Check your details and try again.');
        }
        this.busy.set(false);
      },
    });
  }

  protected logout(): void {
    this.busy.set(true);
    this.jobsService.logout().subscribe({
      next: () => {
        this.authenticated.set(false);
        this.busy.set(false);
      },
      error: () => {
        this.error.set('Could not sign out. Please try again.');
        this.busy.set(false);
      },
    });
  }
}
