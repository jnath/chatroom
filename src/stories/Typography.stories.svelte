<script lang="ts">
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import Typography from "$system/Typography";
</script>

<style lang="postcss" global>
  @import "../theme/index.css";
</style>

<!-- More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export -->
<!-- More on argTypes: https://storybook.js.org/docs/svelte/api/argtypes -->
<Meta
  title="Typography"
  component={Typography}
  argTypes={{
    variant: {
      control: { type: 'select' },
      options: [
        'headline1',
        'headline2',
        'headline3',
        'headline4',
        'headline5',
        'headline6',
        'subtitle1',
        'subtitle2',
        'body1',
        'body2',
        'caption',
        'button',
        'overline'
      ],
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
      <h2>Headline</h2>
      <hr />
      <div style="display:flex; gap: 16px;">
        <Typography {...args} variant="headline1" on:click={args.onClick}>
          Headline 1
        </Typography>
        <Typography {...args} variant="headline2" on:click={args.onClick}>
          Headline 2
        </Typography>
        <Typography {...args} variant="headline3" on:click={args.onClick}>
          Headline 3
        </Typography>
        <Typography {...args} variant="headline4" on:click={args.onClick}>
          Headline 4
        </Typography>
        <Typography {...args} variant="headline5" on:click={args.onClick}>
          Headline 5
        </Typography>
        <Typography {...args} variant="headline6" on:click={args.onClick}>
          Headline 6
        </Typography>
      </div>
    </div>
    <div>
      <h2>Subtitle</h2>
      <hr />
      <div style="display:flex; gap: 16px;">
        <Typography {...args} variant="subtitle1" on:click={args.onClick}>
          Subtitle 1
        </Typography>
        <Typography {...args} variant="subtitle2" on:click={args.onClick}>
          Subtitle 2
        </Typography>
      </div>
    </div>
    <div>
      <h2>Body</h2>
      <hr />
      <div style="display:flex; gap: 16px;">
        <Typography {...args} variant="body1" on:click={args.onClick}>
          Body 1
        </Typography>
        <Typography {...args} variant="body2" on:click={args.onClick}>
          Body 2
        </Typography>
      </div>
    </div>
    <div>
      <h2>Caption</h2>
      <div style="display:flex; gap: 16px;">
        <Typography {...args} variant="caption" on:click={args.onClick}>
          Caption
        </Typography>
      </div>
    </div>
    <div>
      <h2>Dynamics</h2>
      <hr />
      <div style="display:flex; gap: 16px;">
        <Typography {...args} on:click={args.onClick}>
          {args.text || 'text'}
        </Typography>
      </div>
    </div>
  </div>
</Template>

<!-- More on args: https://storybook.js.org/docs/svelte/writing-stories/args -->
<Story
  name="Normal"
  args={{}}
/>
