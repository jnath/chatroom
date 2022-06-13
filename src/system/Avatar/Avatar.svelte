<script lang="ts" context="module">
  export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
</script>
<script lang="ts">
  import { stringToColor } from '$helpers/stringToColor';

  export let username: string | null = '';
  export let picture: string | null = '';
  export let online: boolean | null = null;

  const sizes = {
    xs: 8 * 2, // 16
    sm: 8 * 3, // 24
    md: 8 * 5, // 40
    lg: 8 * 7, // 56
    xl: 8 * 11, // 88
    xxl: 8 * 13,
    xxxl: 8 * 17,
  }

  export let size: Size = 'md';
  export let color = stringToColor(username || '');
</script>

<figure
  class:badge={online !== null}
  style:--background-color={color}
  style:--online-color={online ? 'green' : 'red'}
  style:--size="{sizes[size]}px"
>
  {#if picture && picture.trim()}
    <img src={picture} alt={`Avatar of ${username}`} />
  {:else if username}
    <p>{username[0]}</p>
  {/if}
  {#if $$slots.icon}
    <div class="icon">
      <slot name="icon" />
    </div>
  {/if}
</figure>


<style lang="postcss">
  figure {
    --border-radius: 50%;
    --size-default: 40px;
    position: relative;
    width: var(--size, var(--size-default));
    height: var(--size, var(--size-default));
    border-radius: var(--border-radius);
    background-color: var(--background-color);
    margin: 0;
    padding: 0;
    flex-shrink: 0;

    &.badge::after {
      position: absolute;
      content: '';
      display: block;
      width: 20%;
      height: 20%;
      background-color: var(--online-color);
      border-radius: 50%;
      right: 0px;
      bottom: 0px;
      border: solid white 2px;
    }

    img {
      border-radius: var(--border-radius);
      height: 100%;
      width: 100%;
    }

    p {
      font-size: calc(var(--size, var(--size-default)) / 2);
      font-weight: 700;
      line-height: calc(var(--size, var(--size-default)));
      margin: 0;
      text-transform: uppercase;
      text-align: center;
      height: 100%;
      width: 100%;
    }

    & div.icon {
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }

</style>
