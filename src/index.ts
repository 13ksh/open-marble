import './localization';
import options from './options';
import { Roulette } from './roulette';
import { initAppUI } from './ui/app';

const roulette = new Roulette();

(window as any).roulette = roulette;
(window as any).options = options;

document.addEventListener('DOMContentLoaded', () => {
  const boot = () => {
    if (!roulette.isReady) {
      setTimeout(boot, 50);
      return;
    }
    initAppUI(roulette, options);
  };
  boot();
});
