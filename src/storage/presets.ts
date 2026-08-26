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

export const settingsPresets = {
  builtins(): SettingsPreset[] {
    return [
      {
        id: 'builtin-dark',
        title: '다크 (기본)',
        darkMode: true,
        winnerType: 'last',
        winningRank: 1,
        useSkills: true,
        autoRecording: false,
        colors: colors({ background: '#000000', wall: '#00ffff', circle: '#ffff00', line: '#ffffff' }),
      },
      {
        id: 'builtin-light',
        title: '라이트 (기본)',
        darkMode: false,
        winnerType: 'last',
        winningRank: 1,
        useSkills: true,
        autoRecording: false,
        colors: colors({
          background: '#eeeeee',
          wall: '#226f92',
          circle: '#ffcc00',
          line: '#222222',
          skill: '#6699cc',
          winnerBorder: '#000000',
          minimap: '#fefefe',
        }),
      },
      {
        id: 'builtin-neon-pink',
        title: '네온 핑크',
        darkMode: true,
        winnerType: 'last',
        winningRank: 1,
        useSkills: true,
        autoRecording: false,
        colors: colors({ background: '#120018', wall: '#ff2bd6', circle: '#00f0ff', line: '#ff9ad5', skill: '#ff2bd6' }),
      },
      {
        id: 'builtin-ocean',
        title: '오션 블루',
        darkMode: true,
        winnerType: 'last',
        winningRank: 1,
        useSkills: true,
        autoRecording: false,
        colors: colors({ background: '#021526', wall: '#3ec1d3', circle: '#ff9a3c', line: '#a0e9ff', skill: '#3ec1d3' }),
      },
      {
        id: 'builtin-forest',
        title: '포레스트',
        darkMode: true,
        winnerType: 'last',
        winningRank: 1,
        useSkills: true,
        autoRecording: false,
        colors: colors({ background: '#0b1a12', wall: '#3ddc97', circle: '#f4d35e', line: '#c8facc', skill: '#3ddc97' }),
      },
      {
        id: 'builtin-sunset',
        title: '선셋',
        darkMode: true,
        winnerType: 'last',
        winningRank: 1,
        useSkills: true,
        autoRecording: false,
        colors: colors({ background: '#1a0a08', wall: '#ff6b35', circle: '#ffd166', line: '#ffb4a2', skill: '#ff6b35' }),
      },
      {
        id: 'builtin-lavender',
        title: '라벤더',
        darkMode: true,
        winnerType: 'last',
        winningRank: 1,
        useSkills: true,
        autoRecording: false,
        colors: colors({ background: '#151022', wall: '#b388ff', circle: '#ff80ab', line: '#e1bee7', skill: '#b388ff' }),
      },
      {
        id: 'builtin-mono',
        title: '모노크롬',
        darkMode: true,
        winnerType: 'last',
        winningRank: 1,
        useSkills: false,
        autoRecording: false,
        colors: colors({ background: '#111111', wall: '#dddddd', circle: '#888888', line: '#ffffff', skill: '#ffffff' }),
      },
      {
        id: 'builtin-candy',
        title: '캔디',
        darkMode: false,
        winnerType: 'last',
        winningRank: 1,
        useSkills: true,
        autoRecording: false,
        colors: colors({
          background: '#fff5f8',
          wall: '#ff6b9d',
          circle: '#7bdff2',
          line: '#5c4b51',
          skill: '#ff6b9d',
          winnerBorder: '#5c4b51',
          minimap: '#ffe6ef',
        }),
      },
      {
        id: 'builtin-retro',
        title: '레트로 그린',
        darkMode: true,
        winnerType: 'last',
        winningRank: 1,
        useSkills: true,
        autoRecording: false,
        colors: colors({ background: '#001100', wall: '#33ff66', circle: '#ccff00', line: '#99ff99', skill: '#33ff66' }),
      },
      {
        id: 'builtin-gold',
        title: '골드',
        darkMode: true,
        winnerType: 'last',
        winningRank: 1,
        useSkills: true,
        autoRecording: false,
        colors: colors({ background: '#1a1408', wall: '#d4af37', circle: '#fff1a8', line: '#f5e6b8', skill: '#d4af37' }),
      },
      {
        id: 'builtin-ice',
        title: '아이스',
        darkMode: false,
        winnerType: 'last',
        winningRank: 1,
        useSkills: true,
        autoRecording: false,
        colors: colors({
          background: '#e8f4ff',
          wall: '#4ea8de',
          circle: '#48bfe3',
          line: '#023e8a',
          skill: '#0077b6',
          winnerBorder: '#023e8a',
          minimap: '#f0f8ff',
        }),
      },
      {
        id: 'builtin-clean-neon',
        title: '클린 네온',
        darkMode: true,
        winnerType: 'last',
        winningRank: 1,
        useSkills: true,
        autoRecording: false,
        colors: colors({ background: '#000000', wall: '#00e5ff', circle: '#ffea00', line: '#ffffff' }),
      },
      {
        id: 'builtin-soft',
        title: '소프트 베이지',
        darkMode: false,
        winnerType: 'last',
        winningRank: 1,
        useSkills: true,
        autoRecording: false,
        colors: colors({
          background: '#f3efe6',
          wall: '#8d6e63',
          circle: '#ef9a9a',
          line: '#5d4037',
          skill: '#a1887f',
          winnerBorder: '#5d4037',
          minimap: '#faf6f0',
        }),
      },
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
};
