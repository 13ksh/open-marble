import type { KeywordEntry, KeywordsData } from './types/keyword.type';

/**
 * Shop sprite lookup is disabled in Open Marble.
 * No remote calls to marblerouletteshop.com.
 */
export class KeywordService {
  protected _keywordsData: KeywordsData | null = null;
  protected _spriteSheets: Map<number, HTMLImageElement> = new Map();
  protected _extractedSprites: Map<string, CanvasImageSource> = new Map();

  async init(): Promise<void> {
    this._keywordsData = null;
  }

  destroy(): void {}

  async fetchKeywords(): Promise<void> {}

  getSprite(_marbleName: string): CanvasImageSource | undefined {
    return undefined;
  }

  protected _extractSprite(
    _spriteSheet: HTMLImageElement,
    _x: number,
    _y: number,
    _width: number,
    _height: number
  ): CanvasImageSource {
    return document.createElement('canvas');
  }
}

export type { KeywordEntry };
