/**
 * In-page targets that land somewhere other than their own top, by id: a product on the pinned rail sits beside the
 * others, so its link goes to the scroll position that slides it into view. The rail adds its products while it runs
 * and takes them away when it stops; SmoothScroll reads them when an in-page link is followed.
 */
export const scrollTargets = new Map<string, () => number>();
