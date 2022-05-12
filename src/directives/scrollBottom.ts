
let lastScrollTop = 0;

export default function scrollBottom(
  node: HTMLElement,
): { destroy: () => void } {
  lastScrollTop = node.scrollTop;
  const observer = new MutationObserver(()=>{
    if(node.scrollTop >= lastScrollTop){
      node.scrollTo({
        behavior: 'smooth',
        top: node.scrollHeight
      })
    }
    lastScrollTop = node.scrollTop;
  });

  observer.observe(node, {
    childList: true
  })

  return {
    destroy() {
      observer.disconnect()
    },
  };
}
