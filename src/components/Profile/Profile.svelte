<script>
  import Button from '$system/Button';
  import Paper from '$system/Paper/Paper.svelte';
  import Icon from 'fa-svelte/src/Icon.svelte';
	import { faClose, faCamera } from '@fortawesome/free-solid-svg-icons';
  import Typography from '$system/Typography';
  import Avatar from '$system/Avatar';

</script>

<Paper
  elevation={2}
  --width="75vw"
  --height="75vh"
  >
  <div>
    <header>
      <Typography variant="headline5" --flex="1" --paddingLeft="16px">Profile</Typography>
      <Button variant="icon" --padding="16px"><Icon icon={faClose} /></Button>
    </header>
    <main>
      <Avatar --size="200px"><Icon slot="icon" icon={faCamera} /></Avatar>
    </main>
  </div>
</Paper>

<style lang="postcss">
  div {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    header {
      display: flex;
      width: inherit;
      height: min-content;
      align-items: center;

    }
    main {

    }
  }
</style>

