<script lang="ts">
  /**
   * The HTML Element to observe.
   */
  export let element: HTMLElement | null = null;

  /**
   * Set to `true` to unobserve the element
   * after it intersects the viewport.
   */
  export let once = false;

  /**
   * `true` if the observed element
   * is intersecting the viewport.
   */
  export let intersecting = false;

  /**
   * Specify the containing element.
   * Defaults to the browser viewport.
   */
  export let root: HTMLElement | null = null;

  /** Margin offset of the containing element. */
  export let rootMargin = "0px";

  /**
   * Percentage of element visibility to trigger an event.
   * Value must be between 0 and 1.
   */
  export let threshold = 0;

  /**
   * Observed element metadata.
   */
  export let entry: IntersectionObserverEntry | null = null;

  /**
   * `IntersectionObserver` instance.
   */
  export let observer: IntersectionObserver | null = null;

  import { tick, createEventDispatcher, afterUpdate, onMount } from "svelte";

  const dispatch = createEventDispatcher();

  let prevRootMargin: string | null = null;
  let prevElement: HTMLElement | null = null;

  const initialize = () => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((_entry) => {
          entry = _entry;
          intersecting = _entry.isIntersecting;
        });
      },
      { root, rootMargin, threshold }
    );
  };

  onMount(() => {
    initialize();

    return () => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    };
  });

  afterUpdate(async () => {
    if (entry !== null) {
      dispatch("observe", entry);

      if (entry.isIntersecting) {
        dispatch("intersect", entry);

        if (once && element) observer?.unobserve(element);
      }
    }

    await tick();

    if (element !== null && element !== prevElement) {
      observer?.observe(element);

      if (prevElement !== null) observer?.unobserve(prevElement);
      prevElement = element;
    }

    if (prevRootMargin && rootMargin !== prevRootMargin) {
      observer?.disconnect();
      prevElement = null;
      initialize();
    }

    prevRootMargin = rootMargin;
  });
</script>

<slot {intersecting} {entry} {observer} />
