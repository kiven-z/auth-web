/**
 * 触发浏览器下载 Blob 文件
 * @param blob 文件内容
 * @param filename 保存文件名
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * 从 Content-Disposition 解析文件名（UTF-8 编码形式）
 * @param disposition 响应头 Content-Disposition
 * @param fallback 解析失败时的默认名
 */
export function resolveFilenameFromContentDisposition(disposition: string | undefined, fallback: string): string {
  if (!disposition) {
    return fallback;
  }
  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1].trim());
    } catch {
      return fallback;
    }
  }
  const plainMatch = disposition.match(/filename="?([^";]+)"?/i);
  return plainMatch?.[1]?.trim() || fallback;
}
