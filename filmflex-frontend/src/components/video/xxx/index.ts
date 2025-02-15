import type { Plugin } from 'vue';
import Component from './component';

export type {
  Props as VideoPlayerProps,
  EventKey as VideoPlayerEvents,
  PlayerState as VideoPlayerState
} from './../player2';

export const VideoPlayer = Component;
export const install: Plugin = (app) => {
  app.component('VideoPlayer', Component);
  app.component(Component.name, Component);
};

export default {
  VideoPlayer: Component,
  install
};
