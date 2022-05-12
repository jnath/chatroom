<script lang="ts">
  import { stringToColor } from '$helpers/stringToColor';

  export let name: string;
  export let picture: string;
  export let online = false;

  const color = stringToColor(name);

</script>

<div style={`--background-color:${color}; --online-color:${online ? 'green' : 'red'}`}>
  {#if picture.trim()}
    <img src={picture} alt={`Avatar of ${name}`} />
  {:else}
    <p>{name[0]}</p>
  {/if}
</div>


<style lang="postcss">
  div {
    position: relative;
    width: var(--size, 48px);
    height: var(--size, 48px);
    vertical-align: middle;
    border-radius: 50%;
    background-color: var(--background-color);

    &::after {
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
      font-size: 18px;
      font-weight: 700;
      margin: 0;
      text-transform: uppercase;
      line-height: 50px;
    }
  }

</style>
