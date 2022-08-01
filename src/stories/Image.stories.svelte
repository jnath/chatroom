<script lang="ts">
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import Image from '$system/Image';

  let src: string | undefined;
  const loadImage = ()=>{
    src = "https://edmullen.net/test/rc.jpg";
  }

  const resetImage = ()=>{
    src = undefined;
  }

</script>

<style lang="postcss" global>
  @import "../theme/index.css";
</style>

<!-- More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export -->
<!-- More on argTypes: https://storybook.js.org/docs/svelte/api/argtypes -->
<Meta
  title="Image"
  component={Image}
  argTypes={{
  }}
/>

<!-- More on component templates: https://storybook.js.org/docs/svelte/writing-stories/introduction#using-args -->
<Template let:args>
  <div style="display:flex; flex-direction:column; gap:16px;">
    <div>
      <h2>Image</h2>
      <button on:click={loadImage}>load Image</button>
      <button on:click={resetImage}>reset Image</button>
      <div style="display:flex; gap: 16px;">
        {#if src}
          <Image {src} title="test" width={100} height={100}/>
        {/if}
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
