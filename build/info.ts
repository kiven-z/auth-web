import type { Plugin } from 'vite';
import { name as packageName } from '../package.json';
import { getPackageSize } from './utils';

/**
 * 仅在 production build 结束时打印耗时与产物体积（开发启动不刷屏）。
 */
export function viteBuildInfo(): Plugin {
  let isBuild = false;
  let startTime = 0;
  let outDir = 'dist';

  return {
    name: 'vite:buildInfo',
    configResolved(config) {
      isBuild = config.command === 'build';
      outDir = config.build?.outDir ?? 'dist';
    },
    buildStart() {
      if (isBuild) {
        startTime = Date.now();
      }
    },
    closeBundle() {
      if (!isBuild) {
        return;
      }
      const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
      getPackageSize({
        folder: outDir,
        callback: (size: string) => {
          console.log(`${packageName} · build complete · ${elapsedSec}s · ${size}`);
        },
      });
    },
  };
}
