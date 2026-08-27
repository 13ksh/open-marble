import type { StageDef } from '../data/maps';

export type ThemeColors = {
  background: string;
  wall: string;
  wallBloom: string;
  circle: string;
  circleBloom: string;
  line: string;
  lineBloom: string;
  skill: string;
  winnerBorder: string;
  minimap: string;
};

export type SettingsPreset = {
  id: string;
  title: string;
  darkMode: boolean;
  winnerType: 'first' | 'last' | 'custom';
  winningRank: number;
  useSkills: boolean;
  autoRecording: boolean;
  colors: ThemeColors;
};

export type NamePreset = {
  id: string;
  title: string;
  names: string;
};

export type MapPreset = {
  id: string;
  title: string;
  stage: StageDef;
};

const KEYS = {
  names: 'openmarble.namePresets',
  settings: 'openmarble.settingsPresets',
  maps: 'openmarble.mapPresets',
  lastNames: 'openmarble.lastNames',
  activeSettings: 'openmarble.activeSettingsId',
  activeMap: 'openmarble.activeMapId',
  lastRandomTheme: 'openmarble.lastRandomThemeId',
} as const;

function loadArray<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveArray<T>(key: string, value: T[]): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function uid(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function colors(partial: Partial<ThemeColors> & Pick<ThemeColors, 'background' | 'wall' | 'circle'>): ThemeColors {
  return {
    background: partial.background,
    wall: partial.wall,
    wallBloom: partial.wallBloom ?? partial.wall,
    circle: partial.circle,
    circleBloom: partial.circleBloom ?? partial.circle,
    line: partial.line ?? '#ffffff',
    lineBloom: partial.lineBloom ?? partial.line ?? '#00ffff',
    skill: partial.skill ?? '#ffffff',
    winnerBorder: partial.winnerBorder ?? '#ffffff',
    minimap: partial.minimap ?? '#333333',
  };
}

function builtin(
  id: string,
  title: string,
  darkMode: boolean,
  palette: Partial<ThemeColors> & Pick<ThemeColors, 'background' | 'wall' | 'circle'>
): SettingsPreset {
  return {
    id: `builtin-${id}`,
    title,
    darkMode,
    winnerType: 'last',
    winningRank: 1,
    useSkills: true,
    autoRecording: false,
    colors: colors(palette),
  };
}

export const settingsPresets = {
  builtins(): SettingsPreset[] {
    return [
      builtin('dark', '미드나잇', true, {
        background: '#000000',
        wall: '#00ffff',
        circle: '#ffff00',
        line: '#ffffff',
      }),
      builtin('light', '라이트', false, {
        background: '#eeeeee',
        wall: '#226f92',
        circle: '#ffcc00',
        line: '#222222',
        skill: '#6699cc',
        winnerBorder: '#000000',
        minimap: '#fefefe',
      }),
      builtin('amethyst', '자수정', true, {
        background: '#14081f',
        wall: '#9b59d0',
        circle: '#f0c3ff',
        line: '#d4b0f0',
        skill: '#9b59d0',
      }),
      builtin('matcha', '말차', true, {
        background: '#12180f',
        wall: '#7a9e4c',
        circle: '#d4e07a',
        line: '#c5d4a8',
        skill: '#7a9e4c',
      }),
      builtin('ruby', '루비', true, {
        background: '#160508',
        wall: '#d62839',
        circle: '#ff8a9a',
        line: '#ffc2c8',
        skill: '#d62839',
      }),
      builtin('grape', '포도', true, {
        background: '#140c18',
        wall: '#8e44ad',
        circle: '#f8c8dc',
        line: '#d7bde2',
        skill: '#8e44ad',
      }),
      builtin('coral', '산호', true, {
        background: '#1a0c0c',
        wall: '#ff6f61',
        circle: '#ffd1b3',
        line: '#ffb09a',
        skill: '#ff6f61',
      }),
      builtin('honey', '벌꿀', true, {
        background: '#1a1204',
        wall: '#f0b429',
        circle: '#ffe08a',
        line: '#ffecb3',
        skill: '#f0b429',
      }),
      builtin('forest', '이끼 협곡', true, {
        background: '#07140e',
        wall: '#2bc47a',
        circle: '#e2c046',
        line: '#b4e8bc',
        skill: '#2bc47a',
      }),
      builtin('ocean', '오션 블루', true, {
        background: '#021526',
        wall: '#3ec1d3',
        circle: '#ff9a3c',
        line: '#a0e9ff',
        skill: '#3ec1d3',
      }),
      builtin('neon-pink', '마젠타 플레어', true, {
        background: '#1a0022',
        wall: '#e63bc0',
        circle: '#1ad4e8',
        line: '#f0b4dc',
        skill: '#e63bc0',
      }),
    ];
  },
  list(): SettingsPreset[] {
    const stored = loadArray<SettingsPreset>(KEYS.settings).filter((p) => !p.id.startsWith('builtin-'));
    return [...settingsPresets.builtins(), ...stored];
  },
  get(id: string): SettingsPreset | undefined {
    return settingsPresets.list().find((p) => p.id === id);
  },
  upsert(preset: SettingsPreset) {
    if (preset.id.startsWith('builtin-')) return;
    const users = loadArray<SettingsPreset>(KEYS.settings).filter((p) => !p.id.startsWith('builtin-'));
    const i = users.findIndex((p) => p.id === preset.id);
    if (i >= 0) users[i] = preset;
    else users.push(preset);
    saveArray(KEYS.settings, users);
  },
  remove(id: string) {
    if (id.startsWith('builtin-')) return;
    saveArray(
      KEYS.settings,
      loadArray<SettingsPreset>(KEYS.settings).filter((p) => p.id !== id)
    );
  },
};

export const namePresets = {
  list(): NamePreset[] {
    return loadArray<NamePreset>(KEYS.names);
  },
  get(id: string): NamePreset | undefined {
    return namePresets.list().find((p) => p.id === id);
  },
  upsert(preset: NamePreset) {
    const list = namePresets.list();
    const i = list.findIndex((p) => p.id === preset.id);
    if (i >= 0) list[i] = preset;
    else list.push(preset);
    saveArray(KEYS.names, list);
  },
  remove(id: string) {
    saveArray(
      KEYS.names,
      namePresets.list().filter((p) => p.id !== id)
    );
  },
};

export const mapPresets = {
  list(): MapPreset[] {
    return loadArray<MapPreset>(KEYS.maps);
  },
  save(list: MapPreset[]) {
    saveArray(KEYS.maps, list);
  },
  upsert(preset: MapPreset) {
    const list = mapPresets.list();
    const i = list.findIndex((p) => p.id === preset.id);
    if (i >= 0) list[i] = preset;
    else list.push(preset);
    mapPresets.save(list);
  },
  remove(id: string) {
    mapPresets.save(mapPresets.list().filter((p) => p.id !== id));
  },
  get(id: string): MapPreset | undefined {
    return mapPresets.list().find((p) => p.id === id);
  },
};

export const session = {
  getLastNames(): string | null {
    return localStorage.getItem(KEYS.lastNames);
  },
  setLastNames(names: string) {
    localStorage.setItem(KEYS.lastNames, names);
  },
  getActiveSettingsId(): string | null {
    return localStorage.getItem(KEYS.activeSettings);
  },
  setActiveSettingsId(id: string) {
    localStorage.setItem(KEYS.activeSettings, id);
  },
  getActiveMapId(): string | null {
    return localStorage.getItem(KEYS.activeMap);
  },
  setActiveMapId(id: string | null) {
    if (id == null) localStorage.removeItem(KEYS.activeMap);
    else localStorage.setItem(KEYS.activeMap, id);
  },
  getLastRandomThemeId(): string | null {
    return localStorage.getItem(KEYS.lastRandomTheme);
  },
  setLastRandomThemeId(id: string) {
    localStorage.setItem(KEYS.lastRandomTheme, id);
  },
};
