/** Iconify `addIcon` 所需的 SVG 解析结果 */
export interface SvgInfo {
  /** viewBox / width 解析出的宽度 */
  width: number;
  /** viewBox / height 解析出的高度 */
  height: number;
  /** `<svg>` 内部 HTML */
  body: string;
}

/**
 * 解析 SVG 字符串为 Iconify 离线图标所需结构
 * @param svgString SVG XML 字符串
 * @returns width / height / body；解析失败时返回空结构
 */
export function getSvgInfo(svgString: string): SvgInfo {
  if (typeof DOMParser === 'undefined') {
    return { width: 0, height: 0, body: '' };
  }
  try {
    const document = new DOMParser().parseFromString(svgString, 'image/svg+xml');
    if (document.querySelector('parsererror')) {
      return { width: 0, height: 0, body: '' };
    }
    const svgElement = document.querySelector('svg');
    if (!svgElement) {
      return { width: 0, height: 0, body: '' };
    }

    let width = 0;
    let height = 0;
    const viewBox = svgElement.getAttribute('viewBox');
    if (viewBox) {
      const parts = viewBox.trim().split(/\s+/);
      if (parts.length >= 4) {
        const parsedWidth = parseFloat(parts[2]);
        const parsedHeight = parseFloat(parts[3]);
        if (!Number.isNaN(parsedWidth)) {
          width = parsedWidth;
        }
        if (!Number.isNaN(parsedHeight)) {
          height = parsedHeight;
        }
      }
    }

    if (width === 0 || height === 0) {
      const widthAttribute = svgElement.getAttribute('width');
      const heightAttribute = svgElement.getAttribute('height');
      if (widthAttribute && width === 0) {
        const parsed = parseFloat(widthAttribute);
        if (!Number.isNaN(parsed)) {
          width = parsed;
        }
      }
      if (heightAttribute && height === 0) {
        const parsed = parseFloat(heightAttribute);
        if (!Number.isNaN(parsed)) {
          height = parsed;
        }
      }
    }

    return {
      width: Number.isNaN(width) ? 0 : width,
      height: Number.isNaN(height) ? 0 : height,
      body: svgElement.innerHTML || '',
    };
  } catch {
    return { width: 0, height: 0, body: '' };
  }
}
