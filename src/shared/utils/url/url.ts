const URL_PATTERN =
  /^(?:(https?|ftp|rtsp|mms|ws|wss):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:localhost)|(?:[1-9]\d{0,2}(?:\.\d{1,3}){3})|(?:\$[0-9a-fA-F:]+\$)|(?:(?:[a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,63}))(?::\d{1,5})?(?:[/?#]\S*)?$/i;

/**
 * 判断字符串是否为 URL（含可选协议、localhost、IP、域名）
 * @param value 待检测字符串
 * @returns 是否像 URL
 */
export function isUrl(value: string): boolean {
  return URL_PATTERN.test(value);
}

/**
 * 通过临时 `<a>` 打开外链（默认新标签，带 noopener）
 * @param href 链接地址
 * @param target 打开目标，默认 `_blank`
 */
export function openLink(href: string, target = '_blank'): void {
  if (typeof document === 'undefined') {
    return;
  }
  const anchor = document.createElement('a');
  anchor.setAttribute('href', href);
  anchor.setAttribute('target', target);
  anchor.setAttribute('rel', 'noreferrer noopener');
  anchor.setAttribute('id', 'external');
  const existing = document.getElementById('external');
  if (existing) {
    document.body.removeChild(existing);
  }
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
