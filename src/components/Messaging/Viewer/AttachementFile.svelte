<script lang="ts">
  import type { Attachement } from './Attachements.svelte';
  import { createEventDispatcher } from 'svelte';

  import Image from '$system/Image';
	import { getImageKitUrl } from '$helpers/imageKit';

  const dispatch = createEventDispatcher();

  export let file: Attachement;
	$: thumbnail = `${getImageKitUrl(file.src)}?tr=w-50`
</script>

<file>
  <file-image on:click={()=> dispatch('preview')} >
    <Image src={thumbnail} title={file.name} />
  </file-image>
  <file-name title={file.name}>{file.name}</file-name>
</file>


<style lang="postcss">

	@import '../../../system/styles/mixin.css';

  file {
    display: flex;
    flex-direction: column;
    position: relative;

		&-image {
      display: flex;
			align-items: center;
			justify-content: center;

			background-color: grey;
			overflow: hidden;
			cursor: pointer;

			width: 50px;
			height: 50px;
      border-radius: 4px;
		}

		&-name {
			display: block;
			width: 50px;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;

			@mixin font body2;
		}
  }

</style>
