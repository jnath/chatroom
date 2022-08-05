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
    };
  }

  export let isBottom = false;

  export async function scrollToBottom(){
    await tick();
    await virtualInfiniteList.scrollToBottom();
  }

  async function onInitialize() {
    isBottom = true;
	}


  async function onReachedBottom(){
    isBottom = true;
  }

  const onScroll = ()=>{
    isBottom = false;
  }

  $: {
    if(isBottom && items.length){
      setTimeout(() => {
        virtualInfiniteList.scrollToBottom()
      }, 300);
    }
  }

  onMount(async () => {
    loading = false
  })

  // $: paddingListBottom = showTextEditing ? 24 : 0;

  $: {
    if(virtualInfiniteList && paddingListBottom !== undefined){
      virtualInfiniteList.scrollToBottom();
    }
  }
</script>

<VirtualInfiniteList
  direction={Direction.top}
  {loading}
  {items}
  persists={0}
  uniqueKey={'id'}
  on:initialize={onInitialize}
  on:infinite
  on:scroll={onScroll}
  on:reached:bottom={onReachedBottom}
  bind:start
  bind:end
  bind:this={virtualInfiniteList}
  bind:paddingListBottom
>
  <svelte:fragment slot="item" let:item >
    <slot name="item" {item} />
  </svelte:fragment>
  <div class="loader" slot="loader">
    Loading...
  </div>
</VirtualInfiniteList>

<style land="postcss">

	.loader {
		justify-content: center;
		align-items: center;
		display: flex;
		min-height: 3rem;
	}
</style>
