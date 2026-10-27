// The hand-off from the loader to the hero. Module scope, so coming back to the home page in the same visit finds it
// already resolved and the hero simply plays.

let resolve: () => void = () => {};

/** Resolves once the loader has handed the page over, or at once when there is no loader. */
export const introDone: Promise<void> = new Promise<void>((r) => {
  resolve = r;
});

export function finishIntro() {
  resolve();
}
