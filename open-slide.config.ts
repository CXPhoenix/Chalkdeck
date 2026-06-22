import type { OpenSlideConfig } from '@open-slide/core';

const openSlideConfig: OpenSlideConfig = {
  // 本機 dev/build 維持 root '/'；CI 部署到 GitHub Pages 專案站時，
  // workflow 會設 OSD_BASE=/Chalkdeck/ 讓資產走子路徑（避免 404）。
  base: process.env.OSD_BASE || '/',
};

export default openSlideConfig;
