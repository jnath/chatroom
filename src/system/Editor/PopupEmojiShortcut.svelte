<script lang="ts">
  import type { EmojiData } from '$system/EmojiSelector/data';

  import { createEventDispatcher, onMount } from 'svelte';

  import List from '$system/List/List.svelte';
  import ListItemButton from '$system/List/ListItemButton.svelte';
  import ListItemIcon from '$system/List/ListItemIcon.svelte';
  import ListItemText from '$system/List/ListItemText.svelte';
  import Paper from '$system/Paper';
  import Popper from '$system/Popper';

  export let pos: { x: number, y: number};
  export let items: EmojiData[];

  export let offsetHeight: number;

  const dispatch = createEventDispatcher();

  let selectItem = 0;
  const onKeyDown = (e: KeyboardEvent)=>{
    if(e.key === 'ArrowDown'){
      e.preventDefault();
      if(selectItem < items.length -1) {
        selectItem = selectItem + 1;
      }
    } else if(e.key === 'ArrowUp') {
      e.preventDefault();
      if(selectItem > 0){
        selectItem = selectItem - 1;
      }
    } else if(e.key === 'Enter') {
      dispatch('select', items[selectItem].emoji )
    } else if(e.key === 'Escape') {
      dispatch('close')
    }
  }

  onMount(()=>{
    document.addEventListener('keydown', onKeyDown);

    return ()=>{
      document.removeEventListener('keydown', onKeyDown);
    }
  })

  $: {
    if(items.length){
      selectItem = 0;
    }
  }

</script>
<Popper pos={pos}>
  <Paper>
    <div
      bind:offsetHeight
      style:height="300px"
      style:overflow="auto"
    >
      <List>
        {#each items as item, i }
          <!-- <ListItemButton
            selected={selectItem === i}
            on:click={()=>dispatch('select', item.emoji )}
            on:keydown={()=>dispatch('select', item.emoji )}
            > -->
          <ListItemButton
            selected={selectItem === i}
            on:click={()=>dispatch('select', item.emoji )}
          >
            <ListItemIcon>{item.emoji}</ListItemIcon>
            <ListItemText>{item.name}</ListItemText>
          </ListItemButton>
        {/each}
      </List>
    </div>
  </Paper>
</Popper>
