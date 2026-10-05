import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RevealDirective } from '../shared/reveal.directive';

@Component({
  selector: 'app-blog-detail-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RevealDirective],
  templateUrl: './blog-detail-page.html',
})
export class BlogDetailPage {
  private readonly route = inject(ActivatedRoute);

  protected readonly articleTitle = computed(() => {
    const slug = this.route.snapshot.paramMap.get('slug');
    const labels: Record<string, string> = {
      'product-scaling': 'What makes a digital product truly scalable?',
      'design-clarity': 'Why enterprise transformation needs design clarity',
      'ai-product-experiences': 'The future of AI-driven product experiences',
    };

    return labels[slug ?? ''] ?? 'Digital product strategy';
  });
}
