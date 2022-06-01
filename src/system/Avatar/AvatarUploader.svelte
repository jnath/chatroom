<script lang="ts">

  import Avatar from './Avatar.svelte';

  import Icon from 'svelte-fa';
	import { faUpload } from '@fortawesome/free-solid-svg-icons';
  import Paper from '$system/Paper';

  export let username: string;
  export let picture: string;
  export let files: FileList | undefined = undefined;
</script>

<Avatar size="xxxl" {username} {picture}>
  <Paper slot="icon" elevation={2}>
    <label for="inputAvatar">
      <Icon icon={faUpload} />
      <input
        name="inputAvatar"
        class="inputAvatar"
        accept="image/png, image/jpeg"
        type="file"
        bind:files
      />
    </label>
  </Paper>
</Avatar>

<style lang="postcss">
  label[for="inputAvatar"] {
    display: block;
    padding: 5px;
    position: relative;
  }
  .inputAvatar {
    opacity: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
    font-size: 0;
  }
</style>
