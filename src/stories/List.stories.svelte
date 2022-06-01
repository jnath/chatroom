<script lang="ts">
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import List from "$system/List/List.svelte";
  import ListItem from "$system/List/ListItem.svelte";
  import ListItemButton from "$system//List/ListItemButton.svelte";
  import ListItemText from '$system/List/ListItemText.svelte';
  import ListItemIcon from '$system/List/ListItemIcon.svelte';

  import Icon from 'svelte-fa';
	import { faCat } from '@fortawesome/free-solid-svg-icons';

</script>

<style lang="postcss" global>
  @import "../theme/index.css";
</style>

<!-- More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export -->
<!-- More on argTypes: https://storybook.js.org/docs/svelte/api/argtypes -->
<Meta
  title="List"
  component={List}
  argTypes={{
    onClick: { action: "onClick" },
  }}
/>

<!-- More on component templates: https://storybook.js.org/docs/svelte/writing-stories/introduction#using-args -->
<Template let:args>
  <List {...args} >
    <ListItem>
      <ListItemButton on:click={args.onClick}>
        <ListItemIcon>
          <Icon icon={faCat} />
        </ListItemIcon>
        <ListItemText>Toto</ListItemText>
      </ListItemButton>
    </ListItem>
    <ListItem>
      <ListItemButton on:click={args.onClick}>
        toutou
      </ListItemButton>
    </ListItem>
    <ListItem>
      <ListItemButton on:click={args.onClick}>
        tata
      </ListItemButton>
    </ListItem>
    <ListItem>
      <ListItemButton on:click={args.onClick}>
        coco
      </ListItemButton>
    </ListItem>
  </List>
</Template>

<!-- More on args: https://storybook.js.org/docs/svelte/writing-stories/args -->
<Story
  name="Normal"
  args={{}}
/>
