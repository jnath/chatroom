export default function clickOutside(
  node: HTMLElement,
  handler: () => void
): { destroy: () => void } {
  const onClick = (event: MouseEvent) =>
    node &&
    !node.contains(event.target as HTMLElement) &&
    !event.defaultPrevented &&
    handler();

  document.addEventListener('mousedown', onClick, true);

  return {
    destroy() {
      document.removeEventListener('mousedown', onClick, true);
    },
  };
}
