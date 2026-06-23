import type { OpenSlideConfig } from '@open-slide/core';

const openSlideConfig: OpenSlideConfig = {
  // 本機 dev/build 維持 root '/'；CI 部署走 custom domain（chalkdeck.rtfm.diy，服務於根目錄），
  // workflow 設 OSD_BASE=/。若日後改回 github.io 子路徑（/<repo>/）服務，需改回 /<repo>/，否則 assets 全 404。
  base: process.env.OSD_BASE || '/',
};

export default openSlideConfig;
