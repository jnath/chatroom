<script lang="ts" context="module">
  export type Variant = 'container' | 'outlined' | 'text';
  export type Style = 'primary' | 'secondary';
</script>

<script lang="ts">
  export let variant: Variant = 'container';
  export let style: Style = 'primary';
</script>

<button
  on:click|preventDefault
  class:container={variant === 'container'}
  class:outlined={variant === 'outlined'}
  class:text={variant === 'text'}
  class:primary={style === "primary"}
  class:secondary={style === "secondary"}
  {...$$props}
>
  <slot/>
</button>

<style lang="postcss">
  @import '../styles/mixin.css';

  * {
    margin: 0;
    outline: 0;
    padding: var(--padding, 6px 16px);

    text-align: center;

    width: var(--width, max-content);
    overflow: visible;

    background: var(--background, transparent);

    /* inherit font & color from ancestor */
    color: var(--color, inherit);
    font: inherit;

    /* Normalize `line-height`. Cannot be changed from `normal` in Firefox 4+. */
    /* line-height: normal; */

    /* Corrects font smoothing for webkit */
    -webkit-font-smoothing: inherit;
    -moz-osx-font-smoothing: inherit;

    /* Corrects inability to style clickable `input` types in iOS */
    -webkit-appearance: none;
    cursor: pointer;

    display: inline-flex;
    /* gap: 16px; */
    justify-content: center;
    box-sizing: border-box;

    @mixin font button;

    border: var(--border, none);

  }

  *.container {
    transition: background 0.25s ease;
    &.primary {
      --background: var(--palette-primary-main);
      --backgroundHover: var(--palette-primary-dark);
      --borderColorHover: none;
      --color: var(--palette-primary-contrast);
    }
    &.secondary {
      --background: var(--palette-secondary-main);
      --backgroundHover: var(--palette-secondary-dark);
      --borderColorHover: none;
      --color: var(--palette-secondary-contrast);
    }
    &:hover {
      background: var(--backgroundHover, var(--background));
    }
    &:disabled {
      --background:  var(--action-disabledBackground);
      --backgroundHover: var(--background);
      --color: var(--action-disabled)
    }
  }
  *.outlined {
    transition: border 0.25s ease;
    padding: 5px 16px;
    &.primary {
      --border: 1px solid var(--palette-primary-main);
      --borderHover: 1px solid var(--palette-primary-dark);
    }
    &.secondary {
      --border: 1px solid var(--palette-secondary-main);
      --borderHover: 1px solid var(--palette-secondary-dark);
    }
    &:hover {
      border: var(--borderHover, var(--border));
    }
    &:disabled {
      --border:  1px solid var(--action-disabledBackground);
      --borderHover: var(--border);
      --color: var(--action-disabled)
    }
  }
  *.text {
    &:disabled {
      --color: var(--action-disabled)
    }
  }
</style>
