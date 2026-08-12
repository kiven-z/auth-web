/**
 * 清洗下载文件名（去掉路径分隔与控制字符）
 * @param filename 原始文件名
 * @param fallback 空名时的回退
 * @returns 可安全用于 download 属性的文件名
 */
export function sanitizeDownloadFilename(filename: string | undefined | null, fallback = 'download'): string {
  const trimmed = filename?.trim();
  if (!trimmed) {
    return fallback;
  }
  const cleaned = Array.from(trimmed.replaceAll(/[/\\?%*:|"<>]/g, '_'))
    .filter((ch) => {
      const code = ch.codePointAt(0) ?? 0;
      return code > 0x1f && code !== 0x7f;
    })
    .join('');
  return cleaned.length > 0 ? cleaned : fallback;
}

/**
 * 触发浏览器下载 Blob 文件
 * @param blob 文件内容
 * @param filename 保存文件名
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = sanitizeDownloadFilename(filename);
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

/**
 * 拉取远程 URL 并以指定文件名触发下载（用于预签名对象存储地址）
 * @param url 文件地址
 * @param filename 保存文件名
 */
export async function downloadUrlAsFile(url: string, filename: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Download failed: HTTP ${response.status}`);
  }
  const blob = await response.blob();
  downloadBlob(blob, filename);
}
