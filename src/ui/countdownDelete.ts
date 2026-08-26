/**
 * Delete button: "삭제" → "2" → "1" → confirm.
 * If idle for 3s, label resets to "삭제".
 */
export function bindCountdownDelete(
  button: HTMLElement,
  onConfirm: () => void,
  options?: { idleMs?: number; label?: string }
) {
  const idleMs = options?.idleMs ?? 3000;
  const baseLabel = options?.label ?? '삭제';
  let step = 0; // 0=삭제, 1=2, 2=1, 3=confirm
  let timer: number | null = null;

  const setLabel = (text: string) => {
    button.textContent = text;
  };

  const reset = () => {
    step = 0;
    setLabel(baseLabel);
    if (timer != null) {
      window.clearTimeout(timer);
      timer = null;
    }
  };

  const armIdle = () => {
    if (timer != null) window.clearTimeout(timer);
    timer = window.setTimeout(reset, idleMs);
  };

  setLabel(baseLabel);

  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    step += 1;
    if (step === 1) {
      setLabel('2');
      armIdle();
      return;
    }
    if (step === 2) {
      setLabel('1');
      armIdle();
      return;
    }
    // step >= 3
    reset();
    onConfirm();
  });

  return { reset };
}
