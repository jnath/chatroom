<script lang="ts">
  import { stringToColor } from '$helpers/stringToColor';

  export let username: string | null = '';
  export let picture: string | null = '';
  export let online: boolean | null = null;

  const color = stringToColor(username || '');

</script>

<div
  role="avatar"
  class:badge={online !== null}
  style={`--background-color:${color}; --online-color:${online ? 'green' : 'red'}`}
>
  {#if picture && picture.trim()}
    <img src={picture} alt={`Avatar of ${username}`} />
  {:else if username}
    <p>{username[0]}</p>
  {/if}
  {#if $$slots.icon}
    <div role="icon">
      <slot name="icon" />
    </div>
  {/if}
</div>


<style lang="postcss">
  div[role="avatar"] {
    position: relative;
    width: var(--size, 40px);
    height: var(--size, 40px);
    border-radius: 50%;
    background-color: var(--background-color);

    &.badge::after {
      position: absolute;
      content: '';
      display: block;
      width: 10px;
      height: 10px;
      background-color: var(--online-color);
      border-radius: 50%;
      right: 0px;
      bottom: 0px;
      border: solid white 2px;
    }

    img {
      border-radius: 50%;
      height: 100%;
      width: 100%;
    }

    p {
      font-size: calc(var(--size, 40px) / 2);
      font-weight: 700;
      line-height: calc(var(--size, 40px));
      margin: 0;
      text-transform: uppercase;
      text-align: center;
      height: 100%;
      width: 100%;
    }

    div[role="icon"]{
      /* height: 100%;
      width: 100%; */
      filter: invert(100%)
    }
  }

</style>
