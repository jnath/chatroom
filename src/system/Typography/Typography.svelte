<script lang="ts" context="module">
  export type Variant =
  'headline1' |
  'headline2' |
  'headline3' |
  'headline4' |
  'headline5' |
  'headline6' |
  'subtitle1' |
  'subtitle2' |
  'body1' |
  'body2'
  // 'caption' |
  // 'button' |
  // 'overline'
;
</script>
<script lang="ts">

  export let variant: Variant | 'inherit' = 'inherit';

  export let gutterBottom = false;
  export let bold = false;

  const variantMapping: Record<string, string> = {
    headline1: 'h1',
    headline2: 'h2',
    headline3: 'h3',
    headline4: 'h4',
    headline5: 'h5',
    headline6: 'h6',
    subtitle1: 'h6',
    subtitle2: 'h6',
    body1: 'p',
    body2: 'p',
    inherit: 'p',
  };
</script>

<svelte:element
  this={variantMapping[variant] || variantMapping.inherit}
  class={variant}
  class:gutterBottom
  class:bold
  {...$$restProps}
>
  <slot />
</svelte:element>

<style lang="postcss">
  @import '../styles/mixin.css';

  * {
    font-family: var(--fontFamily);
    flex: var(--flex);
    margin: 0;

    &.gutterBottom {
      margin: 0px 0px 0.35em;
    }

    &.headline1 {
      @mixin font headline1;
    }

    &.headline2 {
      @mixin font headline2;
    }

    &.headline3 {
      @mixin font headline3;
    }

    &.headline4 {
      @mixin font headline4;
    }

    &.headline5 {
      @mixin font headline5;
    }

    &.headline6 {
      @mixin font headline5;
    }

    &.subtitle1 {
      @mixin font subtitle1;
    }

    &.subtitle2 {
      @mixin font subtitle2;
    }

    &.body1 {
      @mixin font body1;
    }

    &.body2 {
      @mixin font body2;
    }

    &.bold {
      font-weight: bold;
    }
  }


</style>
