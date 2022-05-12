
<button
  on:click|preventDefault
  {...$$props}
>
  <slot/>
</button>

<style lang="postcss">
  button {
    display: flex;
    gap: 16px;
    outline: 0;
    border: 0;
    margin: 0;
    padding: var(--padding, 0);
    box-sizing: border-box;
    font-size: 14px;
    color: var(--color, inherit);
    width: var(--width, auto);
    background: var(--background, none);
    transition: background 0.25s ease;
  }

  button:hover {
    background: var(--background-hover, none);
  }

  button:disabled {
    background: darkgrey;
    color: black;
  }
</style>
