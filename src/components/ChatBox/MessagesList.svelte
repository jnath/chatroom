<script lang="ts">
  import { Direction } from '$system/VirtualInfiniteList/constant';

  import { onMount, tick } from 'svelte'
  import VirtualInfiniteList from '$system/VirtualInfiniteList';
  import type { MessageData } from '$models/Message';

  export let items: MessageData[] = [];
  export let loading = true
  export let paddingListBottom = 0;


  let start: number;
  let end: number;
	let virtualInfiniteList: VirtualInfiniteList<MessageData>

  interface $$Slots {
    item: {
      item: MessageData;
      index: number;
    };
  }

  export let isBottom = true;
  export let isScrolling = false;

  export async function scrollToBottom(){
    await tick();
    await virtualInfiniteList.scrollToBottom();
  }

  async function onInitialize() {
    isBottom = true;
    isScrolling = false;
	}

  async function onReachedBottom(){
    isBottom = true;
  }

  const onScroll = ()=>{
    isBottom = false;
  }

  const onWheel = ()=>{
    isScrolling = true;
  }

  // $: {
  //   if(isBottom && items.length){
  //     // messageList.scrollTo(0, messageList.scrollHeight)
  //     virtualInfiniteList.scrollToBottom()
  //   }
  // }

  onMount(async () => {
    loading = false;
  })



  // $: paddingListBottom = showTextEditing ? 24 : 0;

  // $: {
  //   if(virtualInfiniteList && paddingListBottom !== undefined){
  //     virtualInfiniteList.scrollToBottom();
  //   }
  // }
</script>

<VirtualInfiniteList
  direction={Direction.top}
  {loading}
  items={items}
  persists={1}
  uniqueKey={'id'}
  on:initialize={onInitialize}
  on:infinite
  on:scroll={onScroll}
  on:wheel={onWheel}
  on:reached:bottom={onReachedBottom}
  bind:start
  bind:end
  bind:this={virtualInfiniteList}
  bind:paddingListBottom
>
  <svelte:fragment slot="item" let:item let:index>
    <slot name="item" {item} {index} />
  </svelte:fragment>
  <div class="loader" slot="loader">
    Loading...
  </div>
</VirtualInfiniteList>
