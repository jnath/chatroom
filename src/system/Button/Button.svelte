<script lang="ts" context="module">
  export type Variant = 'container' | 'outlined' | 'text' | 'icon';
  export type Style = 'primary' | 'secondary' | 'none';
</script>

<script lang="ts">
  export let variant: Variant = 'container';
  export let style: Style = 'none';

  $: style = ( variant === 'container' || variant === "outlined" ) && style === "none" ? 'primary' : style;

  export let el: HTMLButtonElement | undefined = undefined;
</script>

<button
  on:click|preventDefault
  bind:this={el}
  class:container={variant === 'container'}
  class:outlined={variant === 'outlined'}
  class:text={variant === 'text'}
  class:icon={variant === 'icon'}
  class:primary={style === "primary"}
  class:secondary={style === "secondary"}
  {...$$restProps}
>
  <slot/>
</button>

<style lang="postcss">
  @import '../styles/mixin.css';

  * {
    margin: 0;
    outline: 0;
    padding: 6px 16px;

    text-align: center;

    width: max-content;
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
    gap: 16px;
    justify-content: center;
    box-sizing: border-box;

    @mixin font button;

    border: var(--border, none);

    height: fit-content;

    flex: var(--flex, 0);
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
      --color: var(--palette-primary-main);
      --border: 1px solid var(--palette-primary-main);
      --borderHover: 1px solid var(--palette-primary-dark);
    }
    &.secondary {
      --color: var(--palette-secondary-main);
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
    transition: color 0.25s ease;

    &.primary {
      --color: var(--palette-primary-main);
    }

    &.secondary {
      --color: var(--palette-secondary-main);
    }
    &:disabled {
      --color: var(--action-disabled)
    }
  }
  *.icon {
    transition: opacity 0.25s ease;
    padding: 8px;

    &.primary {
      --color: var(--palette-primary-main);
    }

    &.secondary {
      --color: var(--palette-secondary-main);
    }
    &:hover {
      opacity: var(--action-selectedOpacity);
    }
  }
</style>
