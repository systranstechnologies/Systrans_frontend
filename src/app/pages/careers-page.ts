import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../shared/reveal.directive';
import { Job, JobsService } from '../shared/jobs.service';

@Component({
  selector: 'app-careers-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RevealDirective],
  templateUrl: './careers-page.html',
})
export class CareersPage implements OnInit {
  private readonly jobsService = inject(JobsService);
  @ViewChild('jobDetailsDialog') private readonly jobDetailsDialog?: ElementRef<HTMLDialogElement>;
  protected readonly selectedJob = signal<Job | null>(null);
  protected readonly jobs = signal<Job[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  ngOnInit(): void {
    this.jobsService.list().subscribe({
      next: (jobs) => {
        this.jobs.set(jobs);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Current opportunities could not be loaded. Please try again later.');
        this.loading.set(false);
      },
    });
  }

  protected openJobDetails(job: Job): void {
    this.selectedJob.set(job);
    this.jobDetailsDialog?.nativeElement.showModal();
  }

  protected closeJobDetails(): void {
    this.jobDetailsDialog?.nativeElement.close();
    this.selectedJob.set(null);
  }

  protected closeOnBackdrop(event: MouseEvent): void {
    if (event.target === this.jobDetailsDialog?.nativeElement) {
      this.closeJobDetails();
    }
  }

  protected applicationLink(job: Job): string {
    if (job.applicationUrl) {
      return job.applicationUrl;
    }
    const subject = encodeURIComponent(`Application: ${job.title}`);
    const body = encodeURIComponent(`Hello SysTrans Technologies,\n\nI would like to apply for the ${job.title} position.`);
    return `mailto:${job.applicationEmail}?subject=${subject}&body=${body}`;
  }
}
