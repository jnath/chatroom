<script lang="ts">
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import Button from "$system/Button/Button.svelte";
import Avatar from '$system/Avatar';
</script>

<style lang="postcss" global>
  @import "../theme/index.css";
</style>

<!-- More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export -->
<!-- More on argTypes: https://storybook.js.org/docs/svelte/api/argtypes -->
<Meta
  title="Button"
  component={Button}
  argTypes={{
    variant: {
      control: { type: 'select' },
      options: ['container', 'outlined', 'text'],
    },
    style: {
      control: { type: 'select' },
      options: ['primary', 'secondary'],
    },
    disabled: {
      control: { type: 'boolean' }
    },
    text: {
      control: { type: 'text'}
    },
    // "--background": { control: "color" },
    // "--backgroundHover": { control: "color" },
    // "--color": { control: "color" },
    // "--padding": { control: "text"},
    onClick: { action: "onClick" },
    // size: {
    //   control: { type: 'select' },
    //   options: ['small', 'medium', 'large'],
    // }
  }}
/>

<!-- More on component templates: https://storybook.js.org/docs/svelte/writing-stories/introduction#using-args -->
<Template let:args>
  <div style="display:flex; flex-direction:column; gap:16px;">
    <div>
      <h2>Basic button</h2>
      <div style="display:flex; gap: 16px;">
        <Button {...args} variant="container" disabled={false} on:click={args.onClick}>
          Container
        </Button>
        <Button {...args} variant="outlined" disabled={false} on:click={args.onClick}>
          Outlined
        </Button>
        <Button {...args} variant="text" disabled={false} on:click={args.onClick}>
          Text
        </Button>
      </div>
    </div>
    <div>
      <h2>Disabled button</h2>
      <div style="">
        <Button {...args} variant="container" disabled={true} on:click={args.onClick}>
          Container
        </Button>
        <Button {...args} variant="outlined" disabled={true} on:click={args.onClick}>
          Outlined
        </Button>
        <Button {...args} variant="text" disabled={true} on:click={args.onClick}>
          Text
        </Button>
      </div>
    </div>
    <div>
      <h2>Avatar button</h2>
      <div style="display:flex; gap: 16px;">
        <Button {...args} variant="icon" on:click={args.onClick}>
          <Avatar username="toto" picture="" />
        </Button>
      </div>
    </div>
    <div>
      <h2>Dynamics</h2>
      <div style="display:flex; gap: 16px;">
        <Button {...args} on:click={args.onClick}>
          {args.text || 'text'}
        </Button>
      </div>
    </div>
  </div>
</Template>

<!-- More on args: https://storybook.js.org/docs/svelte/writing-stories/args -->
<Story
  name="Normal"
  args={{}}
/>
<Story
  name="Disabled"
  args={{
    disabled: true,
  }}
/>
