<script lang="ts">
  import type { FilePrepare } from './Attachements.svelte';

  import { createEventDispatcher } from 'svelte';

  import Icon from 'svelte-fa';
	import { faTrash, faExclamationTriangle, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
  import type { TaskState } from 'firebase/storage';
  import type { Writable } from 'svelte/store';
  import CircleProgressBar from '$system/ProgressBar';

  const dispatch = createEventDispatcher();

  export let file: FilePrepare;

  export let disabled = false;

  let state: Writable<TaskState | ''> = file.progress.state;
  let percent: Writable<number> = file.progress.percent;

  let progressShow = false;
  const onProgressAnimComplete = ()=>{
    progressShow = false;
  }

  $: {
    if(!progressShow && $percent > 0 && $percent < 1 && $state === 'running') {
      progressShow = true;
    }
  }

</script>

<file
  class:disabled
>
  <file-remove on:click={() => dispatch('remove')}>
    <Icon size="xs" icon={faTrash} color="red" />
  </file-remove>
  <file-image on:click={()=> dispatch('preview')} >
    {#if $state === 'running'}
      <file-image-overlay>
        <CircleProgressBar
          progress={$percent}
          on:anim:complete={onProgressAnimComplete}
        />
      </file-image-overlay>
    {:else if $state === 'success'}
      <file-image-overlay>
        <Icon size="lg" color="green" icon={faCircleCheck} />
      </file-image-overlay>
    {:else if $state === 'error'}
      <file-image-overlay>
        <Icon size="lg" color="red" icon={faExclamationTriangle} />
      </file-image-overlay>
    <!-- {:else}
      <file-image-overlay>
        <CircleProgressBar wait />
      </file-image-overlay> -->
    {/if}
    {#await file.preview()}
      <file-image-overlay>
        <CircleProgressBar wait />
      </file-image-overlay>
    {:then src }
      <img src={src?.toString()} alt={file.name} />
    {/await}
  </file-image>
  <file-name title={file.name}>{file.name}</file-name>
</file>


<style lang="postcss">

	@import '../styles/mixin.css';

  file {
    display: flex;
    flex-direction: column;
    position: relative;

    &.disabled {
      color: var(--action-disabled);
      opacity: 0.25;
    }

    &:hover file-remove {
      display: flex;
    }

		&-remove {
			display: none;
			position: absolute;
			right: 0;
			transform: translate(30%, -30%);
			background: white;
			border-radius: 50%;
			padding: 4px;
			cursor: pointer;
      box-shadow: 0 0px 2px 1px rgb(0 0 0 / 20%);
		}


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
			img {
        height: 100%;
				object-fit: cover;
			}
      &-overlay {
        position: absolute;
        opacity: .5;
      }
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
