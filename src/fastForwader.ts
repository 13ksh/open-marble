import type { RenderParameters } from './rouletteRenderer';
import type { Rect } from './types/rect.type';
import type { UIObject } from './UIObject';

/** 진행 중 + 미니맵 밖 누르고 있을 때 배속 (입력은 Roulette에서 처리) */
export class FastForwader implements UIObject {
  private icon: HTMLImageElement;
  private holding = false;
  private running = false;

  constructor() {
    this.icon = new Image();
    this.icon.src = new URL('../assets/images/ff.svg', import.meta.url).toString();
  }

  public get speed(): number {
    return this.running && this.holding ? 3 : 1;
  }

  public setRunning(running: boolean) {
    this.running = running;
    if (!running) this.holding = false;
  }

  public setHolding(holding: boolean) {
    this.holding = this.running && holding;
  }

  update(_deltaTime: number): void {}

  render(ctx: CanvasRenderingContext2D, _params: RenderParameters, width: number, height: number): void {
    if (!this.running || !this.holding) return;
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.drawImage(this.icon, width / 2 - 100, height / 2 - 100, 200, 200);
    ctx.restore();
  }

  getBoundingBox(): Rect | null {
    return null;
  }
}
