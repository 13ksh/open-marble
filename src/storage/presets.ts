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

function builtin(
  id: string,
  title: string,
  darkMode: boolean,
  palette: Partial<ThemeColors> & Pick<ThemeColors, 'background' | 'wall' | 'circle'>,
  useSkills = true
): SettingsPreset {
  return {
    id: `builtin-${id}`,
    title,
    darkMode,
    winnerType: 'last',
    winningRank: 1,
    useSkills,
    autoRecording: false,
    colors: colors(palette),
  };
}

export const settingsPresets = {
  builtins(): SettingsPreset[] {
    return [
      builtin('dark', '다크 (기본)', true, { background: '#000000', wall: '#00ffff', circle: '#ffff00', line: '#ffffff' }),
      builtin('light', '라이트 (기본)', false, {
        background: '#eeeeee',
        wall: '#226f92',
        circle: '#ffcc00',
        line: '#222222',
        skill: '#6699cc',
        winnerBorder: '#000000',
        minimap: '#fefefe',
      }),
      builtin('neon-pink', '마젠타 플레어', true, {
        background: '#1a0022',
        wall: '#e63bc0',
        circle: '#1ad4e8',
        line: '#f0b4dc',
        skill: '#e63bc0',
      }),
      builtin('ocean', '오션 블루', true, {
        background: '#021526',
        wall: '#3ec1d3',
        circle: '#ff9a3c',
        line: '#a0e9ff',
        skill: '#3ec1d3',
      }),
      builtin('forest', '이끼 협곡', true, {
        background: '#07140e',
        wall: '#2bc47a',
        circle: '#e2c046',
        line: '#b4e8bc',
        skill: '#2bc47a',
      }),
      builtin('sunset', '선셋', true, { background: '#1a0a08', wall: '#ff6b35', circle: '#ffd166', line: '#ffb4a2', skill: '#ff6b35' }),
      builtin('lavender', '라벤더', true, { background: '#151022', wall: '#b388ff', circle: '#ff80ab', line: '#e1bee7', skill: '#b388ff' }),
      builtin('mono', '모노크롬', true, { background: '#111111', wall: '#dddddd', circle: '#888888', line: '#ffffff', skill: '#ffffff' }, false),
      builtin('candy', '캔디', false, {
        background: '#fff5f8',
        wall: '#ff6b9d',
        circle: '#7bdff2',
        line: '#5c4b51',
        skill: '#ff6b9d',
        winnerBorder: '#5c4b51',
        minimap: '#ffe6ef',
      }),
      builtin('retro', '레트로 그린', true, { background: '#001100', wall: '#33ff66', circle: '#ccff00', line: '#99ff99', skill: '#33ff66' }),
      builtin('gold', '골드', true, { background: '#1a1408', wall: '#d4af37', circle: '#fff1a8', line: '#f5e6b8', skill: '#d4af37' }),
      builtin('ice', '아이스', false, {
        background: '#e8f4ff',
        wall: '#4ea8de',
        circle: '#48bfe3',
        line: '#023e8a',
        skill: '#0077b6',
        winnerBorder: '#023e8a',
        minimap: '#f0f8ff',
      }),
      builtin('clean-neon', '클린 네온', true, { background: '#000000', wall: '#00e5ff', circle: '#ffea00', line: '#ffffff' }),
      builtin('soft', '소프트 베이지', false, {
        background: '#f3efe6',
        wall: '#8d6e63',
        circle: '#ef9a9a',
        line: '#5d4037',
        skill: '#a1887f',
        winnerBorder: '#5d4037',
        minimap: '#faf6f0',
      }),
      builtin('amethyst', '자수정', true, { background: '#14081f', wall: '#9b59d0', circle: '#f0c3ff', line: '#d4b0f0', skill: '#9b59d0' }),
      builtin('sahara', '사막', true, { background: '#1c1408', wall: '#e0a54d', circle: '#ffd89a', line: '#f5deb0', skill: '#e0a54d' }),
      builtin('sakura', '벚꽃', false, {
        background: '#fff0f4',
        wall: '#d98aa6',
        circle: '#ffc2d4',
        line: '#6b3a4a',
        skill: '#c96b88',
        winnerBorder: '#6b3a4a',
        minimap: '#fff7f9',
      }),
      builtin('grid', '그리드', true, { background: '#080814', wall: '#6e5cff', circle: '#ff4ec8', line: '#c8b8ff', skill: '#6e5cff' }),
      builtin('honey', '벌꿀', true, { background: '#1a1204', wall: '#f0b429', circle: '#ffe08a', line: '#ffecb3', skill: '#f0b429' }),
      builtin('coral', '산호', true, { background: '#1a0c0c', wall: '#ff6f61', circle: '#ffd1b3', line: '#ffb09a', skill: '#ff6f61' }),
      builtin('graphite', '흑연', true, { background: '#1b1d20', wall: '#8a9199', circle: '#c5ccd3', line: '#e8eaed', skill: '#8a9199' }),
      builtin('matcha', '말차', true, { background: '#12180f', wall: '#7a9e4c', circle: '#d4e07a', line: '#c5d4a8', skill: '#7a9e4c' }),
      builtin('ruby', '루비', true, { background: '#160508', wall: '#d62839', circle: '#ff8a9a', line: '#ffc2c8', skill: '#d62839' }),
      builtin('aurora', '오로라', true, { background: '#071018', wall: '#40e0c0', circle: '#c084fc', line: '#a8f0e0', skill: '#40e0c0' }),
      builtin('navy', '남색', true, { background: '#0a1220', wall: '#3d6bb3', circle: '#f2c14e', line: '#9bb8e8', skill: '#3d6bb3' }),
      builtin('peach', '복숭아', false, {
        background: '#fff3ea',
        wall: '#e07a5f',
        circle: '#f4a261',
        line: '#6d3b2a',
        skill: '#e07a5f',
        winnerBorder: '#6d3b2a',
        minimap: '#fff8f2',
      }),
      builtin('lava', '용암', true, { background: '#120606', wall: '#ff3d00', circle: '#ffc107', line: '#ffab91', skill: '#ff3d00' }),
      builtin('soda', '소다', false, {
        background: '#e8fbff',
        wall: '#2ec4b6',
        circle: '#ff6b6b',
        line: '#1a535c',
        skill: '#2ec4b6',
        winnerBorder: '#1a535c',
        minimap: '#f3feff',
      }),
      builtin('steel', '강철', true, { background: '#12151a', wall: '#6b8aa3', circle: '#d0d7de', line: '#b8c5d0', skill: '#6b8aa3' }),
      builtin('maple', '단풍', true, { background: '#160c08', wall: '#d35400', circle: '#f1c40f', line: '#f5cba7', skill: '#d35400' }),
      builtin('grape', '포도', true, { background: '#140c18', wall: '#8e44ad', circle: '#f8c8dc', line: '#d7bde2', skill: '#8e44ad' }),
      builtin('teal', '청록', true, { background: '#061416', wall: '#1abc9c', circle: '#f39c12', line: '#a3e4d7', skill: '#1abc9c' }),
      builtin('study', '서재', true, { background: '#1a1410', wall: '#a67c52', circle: '#e8c39e', line: '#d4c4b0', skill: '#a67c52' }),
      builtin('moonlight', '달빛', true, { background: '#0d1118', wall: '#a8c0d8', circle: '#f0f4f8', line: '#dce6f0', skill: '#a8c0d8' }),
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
