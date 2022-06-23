<script lang="ts">
  import { Direction } from '$system/VirtualInfiniteList/constant';

  import { onMount, tick } from 'svelte'
  import VirtualInfiniteList from '$system/VirtualInfiniteList';
  import type { MessageData } from '$models/Message';

  export let items: MessageData[] = [];
  export let loading = true
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
      }, 10);
    }
  }

  onMount(async () => {
    loading = false
  })
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
  let:item
>
  <!-- <div slot="item">
    <div class="row">
      <div>
        {item.firstName}
      </div>
      {#if item.familyName}
      <div>
        {item.familyName}
      </div>
      {/if}
    </div>
  </div> -->
  <svelte:fragment slot="item" let:item >
    <slot name="item" {item} />
  </svelte:fragment>
  <div class="loader" slot="loader">
    Loading...
  </div>
</VirtualInfiniteList>
<style land="postcss">
  /* .row {
    margin-top: 8px;
    margin-bottom: 8px;
    overflow-wrap: break-word;
		display: flex;
		flex-direction: column;
		border-bottom: medium dotted #f0f0f0;
		align-items: center;
		justify-content: center;
  } */

	/* .virtual-list {
		margin-top: 8px;
		border-top: medium solid #f0f0f0;
		border-bottom: medium solid #f0f0f0;
    flex-grow: 1;
	} */

	.loader {
		justify-content: center;
		align-items: center;
		display: flex;
		min-height: 3rem;
	}
</style>
