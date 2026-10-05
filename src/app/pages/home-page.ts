import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../shared/reveal.directive';

@Component({
  selector: 'app-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(pointermove)': 'trackPointer($event)',
    '(pointerleave)': 'resetPointer()',
    '[style.--parallax-x]': 'parallaxX() + "px"',
    '[style.--parallax-y]': 'parallaxY() + "px"',
  },
  imports: [RouterLink, RevealDirective],
  templateUrl: './home-page.html',
})
export class HomePage {
  protected readonly parallaxX = signal(0);
  protected readonly parallaxY = signal(0);

  protected trackPointer(event: PointerEvent): void {
    if (event.pointerType !== 'mouse') {
      return;
    }

    const visual = event.target instanceof Element ? event.target.closest('.hero-visual') : null;
    if (!visual) {
      this.resetPointer();
      return;
    }

    const bounds = visual.getBoundingClientRect();
    this.parallaxX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 18);
    this.parallaxY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 18);
  }

  protected resetPointer(): void {
    this.parallaxX.set(0);
    this.parallaxY.set(0);
  }
}
