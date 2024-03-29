<script lang="ts" context="module">
  declare global {
    // export interface HTMLSvelteVirtualListRowElement extends HTMLDivElement{
    //   scrollToBottom: ()=>void;
    // }
    interface HTMLElementTagNameMap {
      'svelte-virtual-list-row': HTMLDivElement
    }
  }
</script>
<script lang="ts">
	import { onMount, tick } from 'svelte';

  import scrollBottom from '$directives/scrollBottom';

  type T = $$Generic;
	// props
	export let items: T[];
	export let height = '100%';
	export let itemHeight: number | undefined = undefined;
	// read-only, but visible to consumers via bind:start
	export let start = 0;
	export let end = 0;

	// local state
	let height_map: number[] = [];
	let rows: HTMLDivElement[];
	let viewport: HTMLElement;
	let contents: HTMLElement;
	let viewport_height = 0;
	let mounted = false;

	let top = 0;
	let bottom = 0;
	let average_height: number;

	$: visible = items.slice(start, end).map((data, i) => {
		return { index: i + start, data };
	});

	// whenever `items` changes, invalidate the current heightmap
	$: if (mounted && viewport) refresh(items, viewport_height, itemHeight);

	async function refresh(items: T[], viewport_height: number, itemHeight?: number) {
		const { scrollTop } = viewport;

		await tick(); // wait until the DOM is up to date

		let content_height = top - scrollTop;
		let i = start;

		while (content_height < viewport_height && i < items.length) {
			let row = rows[i - start];

			if (!row) {
				end = i + 1;
				await tick(); // render the newly visible row
				row = rows[i - start];
			}

			const row_height = height_map[i] = itemHeight || row.offsetHeight;
			content_height += row_height;
			i += 1;
		}

		end = i;

		const remaining = items.length - end;
		average_height = (top + content_height) / end;

		bottom = remaining * average_height;
		height_map.length = items.length;

	}

	async function handle_scroll() {
		const { scrollTop } = viewport;
		const old_start = start;

		for (let v = 0; v < rows.length; v += 1) {
			height_map[start + v] = itemHeight || rows[v].offsetHeight;
		}

		let i = 0;
		let y = 0;

		while (i < items.length) {
			const row_height = height_map[i] || average_height;
			if (y + row_height > scrollTop) {
				start = i;
				top = y;

				break;
			}

			y += row_height;
			i += 1;
		}

		while (i < items.length) {
			y += height_map[i] || average_height;
			i += 1;

			if (y > scrollTop + viewport_height) break;
		}

		end = i;

		const remaining = items.length - end;
		average_height = y / end;

		while (i < items.length) height_map[i++] = average_height;
		bottom = remaining * average_height;

		// prevent jumping if we scrolled up into unknown territory
		if (start < old_start) {
			await tick();

			let expected_height = 0;
			let actual_height = 0;

			for (let i = start; i < old_start; i +=1) {
				if (rows[i - start]) {
					expected_height += height_map[i];
					actual_height += itemHeight || rows[i - start].offsetHeight;
				}
			}

			const d = actual_height - expected_height;
			viewport.scrollTo(0, scrollTop + d);
		}


		// TODO if we overestimated the space these
		// rows would occupy we may need to add some
		// more. maybe we can just call handle_scroll again?
	}

  // eslint-disable-next-line no-undef
  export const scrollToIndex = async (index: number, opts?: ScrollToOptions) => {
		const {scrollTop} = viewport;
		const itemsDelta = index - start;
		const _itemHeight = itemHeight || average_height;
		const distance = itemsDelta * _itemHeight;
		opts = {
			left: 0,
			top: scrollTop + distance,
			behavior: 'smooth',
			...opts
		};
		viewport.scrollTo(opts);
	}

  export const scrollToBottom = async ()=>{
    viewport.scrollTo(0, viewport.scrollHeight)
		await scrollToIndex(items.length -1)
  }



	// trigger initial refresh
	onMount(() => {
		rows = contents.getElementsByTagName('svelte-virtual-list-row') as unknown as HTMLDivElement[];
		mounted = true;

	});
</script>

<svelte-virtual-list-viewport
	bind:this={viewport}
	bind:offsetHeight={viewport_height}
	on:scroll={handle_scroll}
	style="height: {height};"
  use:scrollBottom
>
	<svelte-virtual-list-contents
		bind:this={contents}
		style="padding-top: {top}px; padding-bottom: {bottom}px;"
	>
		{#each visible as row (row.index)}
			<svelte-virtual-list-row>
				<slot item={row.data}>Missing template</slot>
			</svelte-virtual-list-row>
		{/each}
	</svelte-virtual-list-contents>
</svelte-virtual-list-viewport>

<style lang="postcss">
	svelte-virtual-list-viewport {
		position: relative;
		overflow-y: auto;
		-webkit-overflow-scrolling:touch;
		display: flex;
    flex-direction: column;
	}

	svelte-virtual-list-contents {
		margin-top: auto;
	}

	svelte-virtual-list-row {
		overflow: hidden;
	}
</style>
