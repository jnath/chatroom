<script lang="ts">
  import Notifications from 'svelte-notifications';
</script>

<Notifications>
  <slot />
</Notifications>

<svelte:head>
  <link href="https://fonts.googleapis.com/css?family=Inter" rel="stylesheet">
</svelte:head>

<style lang="postcss" global>
  @import "normalize.css";
  :root {
    --primary-color: #3982f7;
    --background-primary: white;
    --background-secondary: #EDF0F4;
  }

  /* width */
  ::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background:#EDF0F4;
  }

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

  button {
    border: none;
    margin: 0;
    padding: 0;
    width: auto;
    overflow: visible;

    background: transparent;

    /* inherit font & color from ancestor */
    color: inherit;
    font: inherit;

    /* Normalize `line-height`. Cannot be changed from `normal` in Firefox 4+. */
    line-height: normal;

    /* Corrects font smoothing for webkit */
    -webkit-font-smoothing: inherit;
    -moz-osx-font-smoothing: inherit;

    /* Corrects inability to style clickable `input` types in iOS */
    -webkit-appearance: none;
    cursor: pointer;
  }

  body {
    width: 100vw;
    height: 100vh;
    /* background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradient 60s ease infinite; */

    font-family: Inter, Helvetica, Arial, sans-serif;

  }
  @keyframes gradient {
      0% {
          background-position: 0% 50%;
      }
      50% {
          background-position: 100% 50%;
      }
      100% {
          background-position: 0% 50%;
      }
  }
</style>
