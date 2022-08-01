<script lang="ts">
  import type { Ctx } from '@milkdown/core';
  import twemoji from 'twemoji';

  import Paper from '$system/Paper';
  import Popper from '$system/Popper';

  import { emojiListenerCtx } from './plugins/emoji';
  import type { Emoji } from 'node-emoji';
  import VirtualInfiniteList from '$system/VirtualInfiniteList';
  import ListItemButton from '$system/List/ListItemButton.svelte';
  import ListItemIcon from '$system/List/ListItemIcon.svelte';
  import ListItemText from '$system/List/ListItemText.svelte';
  import { onDestroy, onMount, tick } from 'svelte';

  export let ctx: Ctx;
  export let items: Emoji[] = [];

  let listener = ctx.get(emojiListenerCtx);
  let show = false;
  let anchor: HTMLElement | undefined;
  $: anchor;
  let calculatePosition: ()=>{ top: number, left: number};

  let position: { top: number, left: number} = { top: 0, left: 0};
  $: position;

  let replace: (html: string)=>void;

  $: selectedIndex = 0;

  let list: VirtualInfiniteList<typeof items>;

  onMount(()=>{
    listener.show((ctx, {
      node,
      calculatePosition: _calculatePosition,
      replace: _replace
    })=>{
      selectedIndex = 0;
      show = true;
      calculatePosition = _calculatePosition;
      replace = _replace
      anchor = node as HTMLElement;
    });
    listener.hide(()=>{
      close();
    });
    listener.update(async (ctx, { emojis })=>{
      items = emojis;
      await tick();
      position = calculatePosition?.();
    });

    listener.keyboard((ctx, e: KeyboardEvent)=>{
      if(e.key === 'Enter'){
        send()
      } else if( e.key === 'ArrowDown'){
        if(selectedIndex < 0 || selectedIndex >= items.length - 1) return;
        selectedIndex = selectedIndex + 1;
        list.scrollToIndex(selectedIndex);
      } else if( e.key === 'ArrowUp') {
        if(selectedIndex <= 0 || selectedIndex > items.length - 1) return;
        selectedIndex = selectedIndex - 1;
        list.scrollToIndex(selectedIndex);
      }
    })
  })

  onDestroy(()=>{
    listener?.removeAllListener();
  })

  const close = ()=>{
    show = false;
  }

  const send = ()=>{
    const selectedEmoji = items[selectedIndex];
    replace(twemoji.parse(selectedEmoji.emoji, {
      folder: 'svg',
      ext: '.svg',
      attributes: (title:string)=>({title})
    }))
    close();
  }
  const onSelected = (index: number)=>{
    selectedIndex = index;
    send();
  }
</script>

{#if show}
  <Popper
    on:close={close}
    pos={{x: position.left ,y: position.top, align: 'top'}}
    >
    <Paper elevation={3}>
      <div
        style:height='200px'
        style:width="450px"
      >
        <VirtualInfiniteList
          bind:this={list}
          uniqueKey="key"
          {items}
          persists={1}
          paddingListBottom={0}
        >
          <svelte:fragment slot="item" let:item let:index>
            <ListItemButton
              selected={index === selectedIndex}
              on:click={()=>onSelected(index)}
            >
              <ListItemIcon>
                {@html twemoji.parse(item.emoji, {
                  folder: 'svg',
                  ext: '.svg',
                  attributes: (icon)=>({
                    title: icon,
                    width: "24px",
                    height: "24px"
                  })
                })}
              </ListItemIcon>
              <ListItemText>
                {item.key}
              </ListItemText>
            </ListItemButton>
          </svelte:fragment>
          <div class="loader" slot="loader">
            Loading...
          </div>
        </VirtualInfiniteList>
      </div>
    </Paper>
  </Popper>
{/if}
