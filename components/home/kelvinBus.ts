// The bulb slider's colour temperature, shared with the live 3D bulb (Bulb3D), which lives in another part of the page.

type Listener = (k: number) => void;

let current = 3000;
const listeners = new Set<Listener>();

export const kelvin = {
  get: () => current,
  set(k: number) {
    current = k;
    listeners.forEach((l) => l(k));
  },
  /** Calls `l` on every change; returns the unsubscribe. */
  on(l: Listener) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};
