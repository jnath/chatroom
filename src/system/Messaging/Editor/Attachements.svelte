<script lang="ts" context="module">

	import { AtomList, createPlugin } from '@milkdown/utils';
	import { Plugin } from '@milkdown/prose/state';
	import * as uuid from 'uuid';
	import {

		uploadBytesResumable,
		type FirebaseStorage,
		type StorageError,
		type TaskState
	} from 'firebase/storage';
  let storage: FirebaseStorage;

	let elements = new Set<(filePrepareList: FilePrepare[]) => void>();

	export interface FileUploadResult {
		name: string;
		path: string;
		src: string;
	}

	interface FilePrepareProgress {
		started: boolean;
		percent: Writable<number>;
		state: Writable<TaskState | ''>;
	}

  export interface FilePrepare {
    name: string;
		progress: FilePrepareProgress;
		del: ()=>Promise<void>;
    preview: ()=>Promise<string | ArrayBuffer | null>;
    data: ()=>AttachementData | null;
    getRef: ()=>DocumentReference<AttachementData> | null;
    upload: ()=>Promise<AttachementData | null>;
  }

  function readFileAsync(file: File) {
		return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
			let reader = new FileReader();

			const load = () => {
				reader.removeEventListener('load', load);
				resolve(reader.result);
			};

			reader.addEventListener('load', load);

			reader.onerror = reject;

			reader.readAsDataURL(file);
		});
	}

	const toDb = async (data: FileUploadResult) => {
		const collectionRef = collection(getFirestore(), 'attachements').withConverter(attachementConverter);
		const docRef = await addDoc<AttachementData>(collectionRef, {
			...data,
			date: Timestamp.now(),
		});

		return docRef;
	}

	export const uploadWithFilelist = (files: FileList)=>{
		const fileprepare = Array.from(files).map((file: File): FilePrepare=>{
			const uid = uuid.v4();
			const fileRef = ref(storage, `attachements/${uid}_${file.name}`)
			let fileDataRef: DocumentReference<AttachementData> | null = null;
			let data: AttachementData | null = null;
			let progress: FilePrepareProgress = {
				started: false,
				state: writable(''),
				percent: writable(0),
			};
			return {
				name: file.name,
				progress,
				preview: ()=> readFileAsync(file),
				del: async () => {
					fileDataRef && await deleteDoc(fileDataRef);

					await deleteObject(fileRef)
				},
				getRef(){
					return fileDataRef;
				},
				data(){
					return data;
				},
				upload: async (): Promise<AttachementData | null>=>{
					return new Promise((resolve, reject)=>{

						if(progress.started){
							console.warn('this upload is allready started', fileRef.fullPath);
							return null;
						}
						progress.started = true;
						const uploadTask = uploadBytesResumable(fileRef, file, {
							cacheControl: 'public,max-age=300',
							contentType: 'image/jpeg'
						});
						uploadTask.on(
							'state_changed',
							({bytesTransferred, totalBytes, state})=>{
								progress.percent.set((bytesTransferred / totalBytes));
								progress.state.set(state);
							},
							(error: StorageError) => {
								progress.state.set('error');
								reject(error)
							},
							async () => {
								const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
								data = new AttachementData({
									src: downloadURL,
									path: fileRef.fullPath,
									name: file.name,
									date: Timestamp.now()
								})
								fileDataRef = await toDb({
									src: downloadURL,
									path: fileRef.fullPath,
									name: file.name
								});
								progress.state.set('success');
								resolve(data);
							}
						);
					})
				}
			}
		});

		if (fileprepare) {
      elements.forEach((fn) => fn(fileprepare));
    }
	}

	const uploadWithData = (url: string)=>{
		elements.forEach((fn) => {
			let fileDataRef: DocumentReference<AttachementData> | null = null;
			let data: AttachementData | null = null;
			let progress: FilePrepareProgress = {
				started: false,
				state: writable(''),
				percent: writable(0),
			};
			return fn([
				{
					name: url.substring(url.lastIndexOf('/')+1),
					preview: ()=> Promise.resolve(url),
					progress,
					del: async ()=>{
						fileDataRef && await deleteDoc(fileDataRef);
					},
					getRef(){
						return fileDataRef;
					},
					data(){
						return data;
					},
					upload: async (): Promise<AttachementData | null>=>{
						data = new AttachementData({
							src: url,
							path: new URL(url).pathname,
							name: url.substring(url.lastIndexOf('/')+1)
						});
						fileDataRef = await toDb(data);
						progress.state.set('success');
						return data;
					}
				}
			])
		});
	}

  export const uploadWithDataTransfer = (dataTransfer: DataTransfer)=>{
    const url = dataTransfer?.getData('text/uri-list');
    if (url) {
      uploadWithData(url);
    } else {
			uploadWithFilelist(dataTransfer.files)
    }
  }

	const uploadPlugin = createPlugin<string>(() => {
		return {
			prosePlugins: () => {
				const uploadPlugin = new Plugin({
					props: {
						handlePaste: (view, event) => {
              event.preventDefault();
              event.stopPropagation();
							if (!(event instanceof ClipboardEvent)) {
								return false;
							}
              if(event.clipboardData){
                uploadWithDataTransfer(event.clipboardData);
              }
						},
						handleDrop: (view, event) => {
              event.preventDefault();
              event.stopPropagation();
							if (!(event instanceof DragEvent)) {
								return false;
							}
              if(event.dataTransfer){
                uploadWithDataTransfer(event.dataTransfer);
              }
						}
					}
				});
				return [uploadPlugin];
			}
		};
	});
	export const upload = AtomList.create([uploadPlugin()]);
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { derived, writable, type Writable } from 'svelte/store';


	import Modal from '$system/Modal';
	import Paper from '$system/Paper';
	import PaperHeader from '$system/Paper/PaperHeader.svelte';
	import {
		deleteObject,
		getDownloadURL,
		getStorage,
		ref,
	} from 'firebase/storage';
	import AttachementFile from './AttachementFile.svelte';
	import Image from '$system/Image';
	import { addDoc, collection, deleteDoc, DocumentReference, getFirestore, Timestamp } from 'firebase/firestore';
	import { attachementConverter, AttachementData } from '$models/Attachement';

  export let disabled = false;

	storage = getStorage();

	onMount(() => {
		elements.add(add);
		return () => elements.delete(add);
	});

  type FileLoad = {
    name: string;
    src: string;
  };


	const files = writable<FilePrepare[]>([]);

	export async function reset(){
		$files = [];
	}

	export function add(fileList: FilePrepare[]) {
		fileList.forEach(f=>f.upload())
		$files = $files.concat(fileList);
	}

	function notEmpty<T>(value: T | null | undefined): value is T {
		return value !== null && value !== undefined;
	}

	export let loaded: boolean;
	export let attachements: DocumentReference<AttachementData>[] = [];
	$: allLoaded = derived<Writable<TaskState | "">[], boolean>(
    $files.map(file=>file.progress.state),
    ($states, set)=>{
      set(!($states.filter(state=>state !== 'success').length > 0))
    }
  );

	$: {
		loaded = $allLoaded;
		if(loaded) {
			attachements = $files.map((f) => f.getRef()).filter(notEmpty);
		}
	}

	const removeFile = async (index: number) => {
		await $files[index].del();
		$files?.splice(index, 1);
		$files = $files;
	};

	let selectedFile: FileLoad | undefined;
	$: selectedFile;
	const onFileClick = (file: FilePrepare) => {
		const data = file.data();
		if(data){
			selectedFile = {
				name: data.name,
				src: data.src,
			};
		}
	};

	const onFileClose = () => {
		selectedFile = undefined;
	};

</script>

{#if $files.length}
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
	<files
  >
		{#if $files}
			{#each $files as file, index}
				<AttachementFile {file}
					{disabled}
					on:remove={() => removeFile(index)}
					on:preview={() => onFileClick(file)}
				/>
			{/each}
		{/if}
	</files>
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
	files {
		display: flex;
		gap: 16px;
		border-top: solid 1px var(--palette-divider);
		padding: 8px 8px 0 8px;
	}
</style>
