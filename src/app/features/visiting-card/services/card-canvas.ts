import html2canvas from 'html2canvas';

export function renderCardCanvas(element: HTMLElement): Promise<HTMLCanvasElement> {
  element.classList.add('card-export');
  try {
    return html2canvas(element, {
      backgroundColor: null,
      scale: Math.min(Math.max(window.devicePixelRatio, 3), 4),
      useCORS: true,
      logging: false,
    }).finally(() => element.classList.remove('card-export'));
  } catch (error) {
    element.classList.remove('card-export');
    throw error;
  }
}
