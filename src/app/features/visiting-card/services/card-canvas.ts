import html2canvas from 'html2canvas';

export function renderCardCanvas(element: HTMLElement): Promise<HTMLCanvasElement> {
  return html2canvas(element, {
    backgroundColor: null,
    scale: Math.min(Math.max(window.devicePixelRatio, 3), 4),
    useCORS: true,
    logging: false,
  });
}
