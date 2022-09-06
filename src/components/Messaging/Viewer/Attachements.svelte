<script lang="ts" context="module">
  export interface Attachement {
    src: string;
    name: string;
  }

</script>
<script lang="ts">
	import Modal from '$system/Modal';
	import Paper from '$system/Paper';
	import PaperHeader from '$system/Paper/PaperHeader.svelte';

	import AttachementFile from './AttachementFile.svelte';
	import Image from '$system/Image';

	export let attachements: Attachement[] | null;

	let selectedFile: Attachement | undefined;
	$: selectedFile;
	const onFileClick = (file: Attachement) => {
		selectedFile = {
			name: file.name,
			src: file.src,
		};
	};

	const onFileClose = () => {
		selectedFile = undefined;
	};

</script>

{#if attachements}
	<Modal open={!!selectedFile} on:close={onFileClose}>
		<Paper elevation={3}>
			<PaperHeader on:close={onFileClose} title={selectedFile?.name || ''}>
				<preview>
					{#if selectedFile}
						<Image src={selectedFile.src} title={selectedFile.name} />
					{/if}
				</preview>
			</PaperHeader>
		</Paper>
	</Modal>
	<attachements>
		<files>
			{#if attachements}
				{#each attachements as file, index}
					<AttachementFile {file}
						on:preview={() => onFileClick(file)}
					/>
				{/each}
			{/if}
		</files>
	</attachements>
{/if}

<style lang="postcss">
	preview {
		width: calc(100vw - 50px);
		height: calc(100vh - 120px);
		display: flex;
		align-items: center;
		justify-content: center;

		background-color: grey;
		overflow: hidden;
	}
	attachements {
    flex: 1;
    display: flex;
    overflow: auto;
	}
	files {
		display: flex;
		gap: 16px;
		padding: 8px 8px 0 8px;
		height: 70px;
		min-width: min-content;
	}
</style>
