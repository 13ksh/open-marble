import { Themes } from '../data/constants';
import { stages } from '../data/maps';
import type optionsType from '../options';
import type { Roulette } from '../roulette';
import {
  namePresets,
  session,
  settingsPresets,
  uid,
  type NamePreset,
  type SettingsPreset,
  type ThemeColors,
} from '../storage/presets';
import { bindCountdownDelete } from './countdownDelete';

type Options = typeof optionsType;

const MAP_TITLE_KO: Record<string, string> = {
  'Wheel of fortune': '운명의 수레바퀴',
  BubblePop: '버블팝',
  'Pot of greed': '욕망의 항아리',
  'Yoru ni Kakeru': '밤을 달리다 (원본 맵)',
};

const DEFAULT_COLORS: ThemeColors = {
  background: '#000000',
  wall: '#00ffff',
  wallBloom: '#00ffff',
  circle: '#ffff00',
  circleBloom: '#ffff00',
  line: '#ffffff',
  lineBloom: '#00ffff',
  skill: '#ffffff',
  winnerBorder: '#ffffff',
  minimap: '#333333',
};

let ready = false;
let winnerType: SettingsPreset['winnerType'] = 'last';
let currentColors: ThemeColors = { ...DEFAULT_COLORS };

function page(): 'main' | 'set' {
  return document.body.dataset.page === 'set' ? 'set' : 'main';
}

function $(sel: string): HTMLElement | null {
  return document.querySelector(sel);
}

function getNames(): string[] {
  const area = $('#in_names') as HTMLTextAreaElement | null;
  if (!area) return [];
  return area.value.trim().split(/[,\r\n]/g).map((v) => v.trim()).filter((v) => !!v);
}

function parseName(nameStr: string) {
  const weightRegex = /(\/\d+)/;
  const countRegex = /(\*\d+)/;
  const hasWeight = weightRegex.test(nameStr);
  const hasCount = countRegex.test(nameStr);
  const name = /^\s*([^\/*]+)?/.exec(nameStr)?.[1] ?? '';
  const weight = hasWeight ? parseInt(weightRegex.exec(nameStr)![1].replace('/', ''), 10) : 1;
  const count = hasCount ? parseInt(countRegex.exec(nameStr)![1].replace('*', ''), 10) : 1;
  return { name, weight, count };
}

function setWinnerRank(roulette: Roulette, options: Options, rank: number) {
  const input = $('#in_winningRank') as HTMLInputElement | null;
  if (input) input.value = String(rank);
  options.winningRank = Math.max(0, rank - 1);
  roulette.setWinningRank(options.winningRank);
  document.querySelector('.btn-first-winner')?.classList.toggle('active', winnerType === 'first');
  document.querySelector('.btn-last-winner')?.classList.toggle('active', winnerType === 'last');
  document.querySelector('#in_winningRank')?.classList.toggle('active', winnerType === 'custom');
}

function getReady(roulette: Roulette) {
  const names = getNames();
  roulette.setMarbles(names);
  ready = names.length > 0;
  session.setLastNames(names.join(','));
  if (winnerType === 'first') setWinnerRank(roulette, (window as any).options, 1);
  else if (winnerType === 'last') setWinnerRank(roulette, (window as any).options, Math.max(1, roulette.getCount()));
}

function normalizeNamesField(roulette: Roulette) {
  const area = $('#in_names') as HTMLTextAreaElement | null;
  if (!area) return;
  const nameSource = getNames();
  const nameSet = new Set<string>();
  const nameCounts: Record<string, number> = {};
  nameSource.forEach((nameSrc) => {
    const name = parseName(nameSrc);
    const key = name.weight > 1 ? `${name.name}/${name.weight}` : name.name;
    if (!nameSet.has(key)) {
      nameSet.add(key);
      nameCounts[key] = 0;
    }
    nameCounts[key] += name.count;
  });
  const result: string[] = [];
  Object.keys(nameCounts).forEach((key) => {
    result.push(nameCounts[key] > 1 ? `${key}*${nameCounts[key]}` : key);
  });
  const newValue = result.join(',');
  if (area.value !== newValue) {
    area.value = newValue;
    getReady(roulette);
  }
}

function toast(msg: string) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1400);
}

function readColorsFromUI(): ThemeColors {
  const v = (id: string, fallback: string) => {
    const el = document.querySelector(id) as HTMLInputElement | null;
    return el?.value || fallback;
  };
  if (!$('#in_background')) return { ...currentColors };
  return {
    background: v('#in_background', currentColors.background),
    wall: v('#in_wall', currentColors.wall),
    wallBloom: v('#in_wallBloom', currentColors.wallBloom),
    circle: v('#in_circle', currentColors.circle),
    circleBloom: v('#in_circleBloom', currentColors.circleBloom),
    line: v('#in_line', currentColors.line),
    lineBloom: v('#in_lineBloom', currentColors.lineBloom),
    skill: v('#in_skill', currentColors.skill),
    winnerBorder: v('#in_winnerBorder', currentColors.winnerBorder),
    minimap: v('#in_minimap', currentColors.minimap),
  };
}

function writeColorsToUI(c: ThemeColors) {
  currentColors = { ...c };
  const set = (id: string, value: string) => {
    const el = document.querySelector(id) as HTMLInputElement | null;
    if (el) el.value = value;
  };
  set('#in_background', c.background);
  set('#in_wall', c.wall);
  set('#in_wallBloom', c.wallBloom);
  set('#in_circle', c.circle);
  set('#in_circleBloom', c.circleBloom);
  set('#in_line', c.line);
  set('#in_lineBloom', c.lineBloom);
  set('#in_skill', c.skill);
  set('#in_winnerBorder', c.winnerBorder);
  set('#in_minimap', c.minimap);
}

function applyColorsToTheme(roulette: Roulette, darkMode: boolean, c: ThemeColors) {
  currentColors = { ...c };
  const themeName = darkMode ? 'dark' : 'light';
  const theme = Themes[themeName];
  theme.background = c.background;
  theme.skillColor = c.skill;
  theme.marbleWinningBorder = c.winnerBorder;
  theme.minimapBackground = c.minimap;
  theme.entity.box.fill = c.wall;
  theme.entity.box.outline = c.wall;
  theme.entity.box.bloom = c.wallBloom;
  theme.entity.circle.fill = c.circle;
  theme.entity.circle.outline = c.circle;
  theme.entity.circle.bloom = c.circleBloom;
  theme.entity.polyline.fill = c.line;
  theme.entity.polyline.outline = c.line;
  theme.entity.polyline.bloom = c.lineBloom;
  roulette.setTheme(themeName);
}

function currentSettingsSnapshot(options: Options): Omit<SettingsPreset, 'id' | 'title'> {
  const skillEl = $('#chkSkill') as HTMLInputElement | null;
  const recEl = $('#chkAutoRecording') as HTMLInputElement | null;
  return {
    darkMode: options.darkMode,
    useSkills: skillEl?.checked ?? options.useSkills,
    autoRecording: recEl?.checked ?? options.autoRecording,
    winnerType,
    winningRank: parseInt(($('#in_winningRank') as HTMLInputElement)?.value || '1', 10) || 1,
    colors: readColorsFromUI(),
  };
}

function applySettings(roulette: Roulette, options: Options, preset: SettingsPreset) {
  winnerType = preset.winnerType;
  const skillEl = $('#chkSkill') as HTMLInputElement | null;
  const recEl = $('#chkAutoRecording') as HTMLInputElement | null;
  if (skillEl) skillEl.checked = preset.useSkills;
  if (recEl) recEl.checked = preset.autoRecording;
  options.darkMode = preset.darkMode;
  options.useSkills = preset.useSkills;
  options.autoRecording = preset.autoRecording;
  document.documentElement.classList.toggle('light', !preset.darkMode);
  writeColorsToUI(preset.colors);
  applyColorsToTheme(roulette, preset.darkMode, preset.colors);
  roulette.setAutoRecording(preset.autoRecording);
  if (preset.winnerType === 'last') {
    setWinnerRank(roulette, options, Math.max(1, roulette.getCount() || 1));
  } else if (preset.winnerType === 'first') {
    setWinnerRank(roulette, options, 1);
  } else {
    setWinnerRank(roulette, options, preset.winningRank);
  }
  session.setActiveSettingsId(preset.id);
  const select = $('#sltSettingsPreset') as HTMLSelectElement | null;
  if (select) select.value = preset.id;
}

function fillSettingsSelector(selectedId?: string) {
  const select = $('#sltSettingsPreset') as HTMLSelectElement | null;
  if (!select) return;
  const current = selectedId ?? select.value;
  select.innerHTML = '';
  settingsPresets.list().forEach((preset) => {
    const opt = document.createElement('option');
    opt.value = preset.id;
    opt.textContent = preset.title;
    select.appendChild(opt);
  });
  if (current && [...select.options].some((o) => o.value === current)) select.value = current;
}

function fillNameSelector(selectedId?: string) {
  const select = $('#sltNamePreset') as HTMLSelectElement | null;
  if (!select) return;
  const current = selectedId ?? select.value;
  select.innerHTML = '<option value="">선택…</option>';
  namePresets.list().forEach((preset) => {
    const opt = document.createElement('option');
    opt.value = preset.id;
    opt.textContent = preset.title;
    select.appendChild(opt);
  });
  if (current && [...select.options].some((o) => o.value === current)) select.value = current;
}

function fillMapSelector(_roulette: Roulette) {
  const mapSelector = $('#sltMap') as HTMLSelectElement | null;
  if (!mapSelector) return;
  const previous = mapSelector.value;
  mapSelector.innerHTML = '';
  stages.forEach((stage, index) => {
    const option = document.createElement('option');
    option.value = `builtin:${index}`;
    option.textContent = MAP_TITLE_KO[stage.title] ?? stage.title;
    mapSelector.append(option);
  });
  if (previous && [...mapSelector.options].some((o) => o.value === previous)) {
    mapSelector.value = previous;
  }
}

function applyMapSelection(roulette: Roulette) {
  const mapSelector = $('#sltMap') as HTMLSelectElement | null;
  if (!mapSelector) return;
  const value = mapSelector.value;
  if (value.startsWith('builtin:')) {
    roulette.setMap(parseInt(value.slice('builtin:'.length), 10));
    session.setActiveMapId(null);
  }
}

function bindSettingsPresetControls(roulette: Roulette, options: Options) {
  fillSettingsSelector();
  $('#sltSettingsPreset')?.addEventListener('change', () => {
    const id = ($('#sltSettingsPreset') as HTMLSelectElement).value;
    const preset = settingsPresets.get(id);
    if (preset) {
      applySettings(roulette, options, preset);
      toast(`설정: ${preset.title}`);
    }
  });

  $('#btnAddSettingsPreset')?.addEventListener('click', () => {
    const titleInput = $('#in_settingsPresetName') as HTMLInputElement;
    const title = titleInput?.value.trim();
    if (!title) {
      toast('설정 프리셋 이름을 입력하세요');
      titleInput?.focus();
      return;
    }
    const preset: SettingsPreset = { id: uid(), title, ...currentSettingsSnapshot(options) };
    settingsPresets.upsert(preset);
    fillSettingsSelector(preset.id);
    if (titleInput) titleInput.value = '';
    toast(`설정 저장됨: ${title}`);
  });

  const delSettingsBtn = $('#btnDeleteSettingsPreset');
  if (delSettingsBtn) {
    bindCountdownDelete(delSettingsBtn, () => {
      const id = ($('#sltSettingsPreset') as HTMLSelectElement).value;
      if (!id || id.startsWith('builtin-')) {
        toast('기본 프리셋은 삭제할 수 없습니다');
        return;
      }
      settingsPresets.remove(id);
      fillSettingsSelector();
      const first = settingsPresets.list()[0];
      if (first) applySettings(roulette, options, first);
      toast('설정 프리셋 삭제됨');
    });
  }
}

function bindColorInputs(roulette: Roulette, options: Options) {
  [
    '#in_background',
    '#in_wall',
    '#in_wallBloom',
    '#in_circle',
    '#in_circleBloom',
    '#in_line',
    '#in_lineBloom',
    '#in_skill',
    '#in_winnerBorder',
    '#in_minimap',
  ].forEach((id) => {
    document.querySelector(id)?.addEventListener('input', () => {
      applyColorsToTheme(roulette, options.darkMode, readColorsFromUI());
    });
  });
}

function restoreActiveSettings(roulette: Roulette, options: Options) {
  const activeSettingsId = session.getActiveSettingsId();
  const settingsList = settingsPresets.list();
  const active =
    settingsList.find((p) => p.id === activeSettingsId) ??
    settingsList.find((p) => p.id === 'builtin-last-winner') ??
    settingsList[0];
  if (active) applySettings(roulette, options, active);
}

function bindSettingsIslandResize() {
  const panel = $('#settings');
  const handle = panel?.querySelector('.settings-resize-handle') as HTMLElement | null;
  if (!panel || !handle) return;

  const STORAGE_KEY = 'openmarble.settingsWidth';
  const MIN = 760;
  const maxWidth = () => Math.max(MIN, window.innerWidth - 32);

  const applyWidth = (px: number) => {
    const clamped = Math.max(MIN, Math.min(maxWidth(), Math.round(px)));
    panel.style.width = `${clamped}px`;
    return clamped;
  };

  const saved = Number(localStorage.getItem(STORAGE_KEY));
  if (Number.isFinite(saved) && saved >= MIN) applyWidth(saved);
  else {
    localStorage.removeItem(STORAGE_KEY);
    applyWidth(820);
  }

  let dragging = false;

  handle.addEventListener('pointerdown', (e) => {
    if (window.matchMedia('(max-width: 750px)').matches) return;
    dragging = true;
    panel.classList.add('resizing');
    handle.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  handle.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const rightEdge = panel.getBoundingClientRect().right;
    applyWidth(rightEdge - e.clientX);
  });

  const endDrag = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    panel.classList.remove('resizing');
    try {
      handle.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
    const width = parseInt(panel.style.width, 10);
    if (Number.isFinite(width)) localStorage.setItem(STORAGE_KEY, String(width));
  };

  handle.addEventListener('pointerup', endDrag);
  handle.addEventListener('pointercancel', endDrag);

  window.addEventListener('resize', () => {
    const current = parseInt(panel.style.width || '820', 10);
    applyWidth(current);
  });
}

function initMain(roulette: Roulette, options: Options) {
  const namesArea = $('#in_names') as HTMLTextAreaElement;
  const urlNames = new URLSearchParams(window.location.search).get('names');
  if (urlNames) namesArea.value = urlNames.replace(/,/g, '\n');
  else {
    const saved = session.getLastNames();
    if (saved) namesArea.value = saved;
  }

  namesArea.addEventListener('input', () => getReady(roulette));
  namesArea.addEventListener('blur', () => normalizeNamesField(roulette));

  $('#btnStart')?.addEventListener('click', () => {
    if (!ready) return;
    $('#settings')?.classList.add('hide');
    roulette.start();
  });

  $('#chkAutoRecording')?.addEventListener('change', (e) => {
    options.autoRecording = (e.target as HTMLInputElement).checked;
    roulette.setAutoRecording(options.autoRecording);
  });
  $('#chkSkill')?.addEventListener('change', (e) => {
    options.useSkills = (e.target as HTMLInputElement).checked;
  });

  $('#in_winningRank')?.addEventListener('change', (e) => {
    const v = parseInt((e.target as HTMLInputElement).value, 10);
    winnerType = 'custom';
    setWinnerRank(roulette, options, Number.isNaN(v) ? 1 : v);
  });
  document.querySelector('.btn-last-winner')?.addEventListener('click', () => {
    winnerType = 'last';
    setWinnerRank(roulette, options, Math.max(1, roulette.getCount()));
  });
  document.querySelector('.btn-first-winner')?.addEventListener('click', () => {
    winnerType = 'first';
    setWinnerRank(roulette, options, 1);
  });

  roulette.addEventListener('goal', () => {
    ready = false;
    // Winner 동안 설정 섬은 숨김. 구슬만 다시 섞어 두고, 아무 입력까지 대기.
    setTimeout(() => {
      getReady(roulette);
    }, 3000);

    const revealSettings = () => {
      $('#settings')?.classList.remove('hide');
      window.removeEventListener('pointerdown', revealSettings, true);
      window.removeEventListener('keydown', revealSettings, true);
    };
    window.addEventListener('pointerdown', revealSettings, true);
    window.addEventListener('keydown', revealSettings, true);
  });
  roulette.addEventListener('message', (e) => toast(String((e as CustomEvent).detail)));

  $('#btnToggleSettings')?.addEventListener('click', () => {
    const collapsible = document.querySelector('.collapsible-rows');
    collapsible?.classList.toggle('collapsed');
    const arrow = $('#btnToggleSettings')?.querySelector('.toggle-arrow');
    if (arrow) arrow.textContent = collapsible?.classList.contains('collapsed') ? '▲' : '▼';
  });

  $('#btnOpenExtra')?.addEventListener('click', () => {
    $('#extraSettings')?.classList.toggle('open');
    $('#btnOpenExtra')?.classList.toggle('active');
  });

  fillMapSelector(roulette);
  $('#sltMap')?.addEventListener('change', () => {
    applyMapSelection(roulette);
    if (winnerType === 'last') setWinnerRank(roulette, options, Math.max(1, roulette.getCount()));
  });

  bindColorInputs(roulette, options);
  bindSettingsPresetControls(roulette, options);

  fillNameSelector();
  $('#sltNamePreset')?.addEventListener('change', () => {
    const id = ($('#sltNamePreset') as HTMLSelectElement).value;
    if (!id) return;
    const preset = namePresets.get(id);
    if (!preset) return;
    namesArea.value = preset.names;
    getReady(roulette);
    toast(`이름: ${preset.title}`);
  });
  $('#btnAddNamePreset')?.addEventListener('click', () => {
    const titleInput = $('#in_namePresetName') as HTMLInputElement;
    const title = titleInput.value.trim();
    if (!title) {
      toast('프리셋 이름을 입력하세요');
      titleInput.focus();
      return;
    }
    const preset: NamePreset = { id: uid(), title, names: namesArea.value };
    namePresets.upsert(preset);
    fillNameSelector(preset.id);
    titleInput.value = '';
    toast(`이름 저장됨: ${title}`);
  });
  const delNameBtn = $('#btnDeleteNamePreset');
  if (delNameBtn) {
    bindCountdownDelete(delNameBtn, () => {
      const id = ($('#sltNamePreset') as HTMLSelectElement).value;
      if (!id) {
        toast('삭제할 프리셋을 선택하세요');
        return;
      }
      namePresets.remove(id);
      fillNameSelector();
      toast('이름 프리셋 삭제됨');
    });
  }

  restoreActiveSettings(roulette, options);
  // Ensure default feel is 마지막 if no stored preference beyond builtins
  if (!session.getActiveSettingsId()) {
    winnerType = 'last';
    setWinnerRank(roulette, options, Math.max(1, roulette.getCount() || 1));
  }

  bindSettingsIslandResize();
  getReady(roulette);
}

export function initAppUI(roulette: Roulette, options: Options) {
  // /set 은 메인으로 리다이렉트. 모든 UI는 메인에 합쳐짐.
  if (page() === 'set') {
    location.replace('../index.html');
    return;
  }
  initMain(roulette, options);
}
