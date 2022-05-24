export default function portal(node: HTMLElement) {

	// const container = document.createElement('div');

	// container.appendChild(node);
  document.body.appendChild(node);

	return {
		destroy() {
      node.remove();
		}
	}
}
