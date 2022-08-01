<script lang="ts">
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import CircleProgressBar from '$system/ProgressBar';

  let progress = 0;

  setInterval(()=>{
    if(progress>=1) progress = 0;
    progress = progress + .1;
  }, 1000)
</script>

<style lang="postcss" global>
  @import "../theme/index.css";
</style>

<!-- More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export -->
<!-- More on argTypes: https://storybook.js.org/docs/svelte/api/argtypes -->
<Meta
  title="ProgressBar"
  component={CircleProgressBar}
  argTypes={{
  }}
/>

<!-- More on component templates: https://storybook.js.org/docs/svelte/writing-stories/introduction#using-args -->
<Template let:args>
  <div style="display:flex; flex-direction:column; gap:16px;">
    <div>
      <h2>CircleProgressBar</h2>
      <div style="display:flex; gap: 16px;">
        <CircleProgressBar {progress} />
        <CircleProgressBar wait />
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
