<script lang="ts">
  export let message: string;
</script>
<div class="Message">
  <p>{message}</p>
</div>
<style lang="postcss">
  .Message{
    & > p {
      background-color: rgb(228, 230, 235);
      border-bottom-left-radius: 18px;
      border-bottom-right-radius: 18px;
      border-top-left-radius: 18px;
      border-top-right-radius: 18px;
      direction: ltr;
      display: block;
      font-family: Helvetica, Arial, sans-serif;
      font-size: 15px;
      line-height: 20.1px;
      overflow-wrap: break-word;
      overflow-x: hidden;
      overflow-y: hidden;
      padding-bottom: 8px;
      padding-left: 12px;
      padding-right: 12px;
      padding-top: 7px;
      position: relative;
      white-space: pre-wrap;
      word-break: break-word;
      -webkit-font-smoothing: antialiased;
      color: rgb(5, 5, 5);
      unicode-bidi: isolate;
      white-space: pre-wrap;
      width: fit-content;
    }
  }
</style>
