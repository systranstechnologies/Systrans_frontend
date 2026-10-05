export type LogoFileValidationError = 'type' | 'size' | 'content';

const allowedExtensions = new Set(['png', 'jpg', 'jpeg', 'svg']);
const allowedMimeTypes = new Set(['image/png', 'image/jpeg', 'image/svg+xml']);
const maxFileSize = 5 * 1024 * 1024;

export function validateLogoFile(file: File): LogoFileValidationError | null {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (!extension || !allowedExtensions.has(extension)) {
    return 'type';
  }

  if (file.type && !allowedMimeTypes.has(file.type.toLowerCase())) {
    return 'type';
  }

  if (file.size > maxFileSize) {
    return 'size';
  }

  return null;
}

export function sanitizeSvg(source: string): string | null {
  const document = new DOMParser().parseFromString(source, 'image/svg+xml');
  const root = document.documentElement;

  if (
    root.localName !== 'svg' ||
    document.querySelector('parsererror, script, foreignObject, iframe, object, embed, audio, video')
  ) {
    return null;
  }

  for (const element of Array.from(document.querySelectorAll('*'))) {
    for (const attribute of Array.from(element.attributes)) {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim();

      if (
        name.startsWith('on') ||
        name === 'style' ||
        (['href', 'xlink:href'].includes(name) && value && !value.startsWith('#')) ||
        /url\s*\(/i.test(value)
      ) {
        element.removeAttribute(attribute.name);
      }
    }
  }

  return new XMLSerializer().serializeToString(root);
}
