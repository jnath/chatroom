<script lang="ts">
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import Menu from "./Menu.svelte";
  import MenuItem from "./MenuItem.svelte";
  import ListItemText from '$system/List/ListItemText.svelte';
  import ListItemIcon from '$system/List/ListItemIcon.svelte';
  import Icon from 'svelte-fa';
	import { faCat } from '@fortawesome/free-solid-svg-icons';
  import Button from '$system/Button';

  let open = false;
  const toogleMenu = ()=>{
    open = !open;
  }
  export let anchorButton: HTMLButtonElement;

</script>

<style lang="postcss" global>
  @import "../../theme/index.css";
</style>

<!-- More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export -->
<!-- More on argTypes: https://storybook.js.org/docs/svelte/api/argtypes -->
<Meta
  title="Menu"
  component={Menu}
  argTypes={{
    open: { control: { type: 'boolean'}},
    onClick: { action: "onClick" },
  }}
/>

<!-- More on component templates: https://storybook.js.org/docs/svelte/writing-stories/introduction#using-args -->
<Template let:args>
  <div style="display:flex; flex-direction:column; gap:16px;">
    <div>
      <h2>Basic Menu</h2>
      <div style="display:flex; gap: 16px; height: 200px">
        <Menu>
          <MenuItem on:click={args.onClick}>
            <ListItemIcon>
              <Icon icon={faCat} />
            </ListItemIcon>
            <ListItemText>Toto</ListItemText>
          </MenuItem>
          <MenuItem>
              toutou
          </MenuItem>
          <MenuItem>
              tata
          </MenuItem>
          <MenuItem>
              coco
          </MenuItem>
        </Menu>
      </div>
    </div>
  </div>
  <div style="display:flex; flex-direction:column; gap:16px;">
    <div>
      <h2>Popper Menu with button</h2>
      <div style="display:flex; gap: 16px;  height: 200px">
        <Button on:click={toogleMenu}>Open Menu {open}</Button>
        <Menu {open}>
          <MenuItem on:click={args.onClick}>
            <ListItemIcon>
              <Icon icon={faCat} />
            </ListItemIcon>
            <ListItemText>Toto</ListItemText>
          </MenuItem>
          <MenuItem>
              toutou
          </MenuItem>
          <MenuItem>
              tata
          </MenuItem>
          <MenuItem>
              coco
          </MenuItem>
        </Menu>
      </div>
    </div>
  </div>
  <div style="display:flex; flex-direction:column; gap:16px;">
    <div>
      <h2>Popper Menu with button popper</h2>
      <div style="display:flex; gap: 16px;  height: 200px">
        <Button
          on:click={toogleMenu}
          bind:el={anchorButton}
          >Open Menu {open}
        </Button>
        <Menu
          {open}
          anchor={anchorButton}
        >
          <MenuItem on:click={args.onClick}>
            <ListItemIcon>
              <Icon icon={faCat} />
            </ListItemIcon>
            <ListItemText>Toto</ListItemText>
          </MenuItem>
          <MenuItem>
              toutou
          </MenuItem>
          <MenuItem>
              tata
          </MenuItem>
          <MenuItem>
              coco
          </MenuItem>
        </Menu>
      </div>
    </div>
  </div>
  <div style="display:flex; flex-direction:column; gap:16px;">
    <div>
      <h2>Popper Menu</h2>
      <div style="display:flex; gap: 16px;  height: 200px">
        <Menu {...args} >
          <MenuItem on:click={args.onClick}>
            <ListItemIcon>
              <Icon icon={faCat} />
            </ListItemIcon>
            <ListItemText>Toto</ListItemText>
          </MenuItem>
          <MenuItem>
              toutou
          </MenuItem>
          <MenuItem>
              tata
          </MenuItem>
          <MenuItem>
              coco
          </MenuItem>
        </Menu>
      </div>
    </div>
  </div>
</Template>

<!-- More on args: https://storybook.js.org/docs/svelte/writing-stories/args -->
<Story
  name="Normal"
  args={{}}
/>
