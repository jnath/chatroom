<script lang="ts">
	import type { EmojiData } from './data';

	import { createEventDispatcher, onMount } from 'svelte';

	import {
		faBuilding,
		faFlag,
		faLightbulb,
		faSmile,
		type IconDefinition
	} from '@fortawesome/free-regular-svg-icons';
	import { faCat, faCoffee, faFutbol, faHistory, faMusic } from '@fortawesome/free-solid-svg-icons';
	import Icon from 'svelte-fa';

	import { Tabs, Tab, TabList, TabPanel } from 'svelte-tabs';

	import Button from '$system/Button';
	import Popper from '$system/Popper';

	import EmojiDetail from './EmojiDetail.svelte';
	import EmojiList from './EmojiList.svelte';
	import EmojiSearch from './EmojiSearch.svelte';
	import EmojiSearchResults from './EmojiSearchResults.svelte';
	import VariantPopup from './VariantPopup.svelte';

	import { data as emojiData } from './data/emoji.json';

	const smileIcon = faSmile;

	export let maxRecents = 50;
	export let autoClose = true;

	let variantsVisible = false;
	let pickerVisible = false;

	let variants: Record<string, EmojiData>;
	let currentEmoji: EmojiData;
	let searchText: string | undefined;
	let recentEmojis: EmojiData[];

	onMount(() => {
		recentEmojis = JSON.parse(localStorage?.getItem('svelte-emoji-picker-recent') || '[]') || [];
	});

	const dispatch = createEventDispatcher();

	const emojiCategories: Record<string, EmojiData[]> = {};
	emojiData.forEach((emoji) => {
		let categoryList = emojiCategories[emoji.category];
		if (!categoryList) {
			categoryList = emojiCategories[emoji.category] = [];
		}

		categoryList.push(emoji);
	});
	const categoryOrder = [
		'Smileys & People',
		'Animals & Nature',
		'Food & Drink',
		'Activities',
		'Travel & Places',
		'Objects',
		'Symbols',
		'Flags'
	];

	const categoryIcons: Record<string, IconDefinition> = {
		'Smileys & People': faSmile,
		'Animals & Nature': faCat,
		'Food & Drink': faCoffee,
		Activities: faFutbol,
		'Travel & Places': faBuilding,
		Objects: faLightbulb,
		Symbols: faMusic,
		Flags: faFlag
	};

	function hidePicker() {
		pickerVisible = false;
	}

	async function togglePicker() {
		pickerVisible = !pickerVisible;
	}

	function onKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
		  hidePicker();
		}
	}

	function showEmojiDetails(event: CustomEvent) {
		currentEmoji = event.detail;
	}

	function onEmojiClick(event: CustomEvent) {
		if (event.detail.variants) {
			variants = event.detail.variants;
			variantsVisible = true;
		} else {
			dispatch('emoji', event.detail.emoji);
			saveRecent(event.detail);

			if (autoClose) {
			  hidePicker();
			}
		}
	}

	function onVariantClick(event: CustomEvent) {
		dispatch('emoji', event.detail.emoji);
		saveRecent(event.detail);
		hideVariants();

		if (autoClose) {
			hidePicker();
		}
	}

	function saveRecent(emoji: EmojiData) {
		recentEmojis = [emoji, ...recentEmojis.filter((recent) => recent.key !== emoji.key)].slice(
			0,
			maxRecents
		);
		localStorage.setItem('svelte-emoji-picker-recent', JSON.stringify(recentEmojis));
	}

	function hideVariants() {
		// We have to defer the removal of the variants popup.
		// Otherwise, it gets removed before the click event on the body
		// happens, and the target will have a `null` parent, which
		// means it will not be excluded and the clickoutside event will fire.
		setTimeout(() => {
			variantsVisible = false;
		});
	}

	let buttonRef: Button;
	$: anchor = buttonRef?.$$?.ctx?.[0];
</script>

<svelte:body on:keydown={onKeyDown} />
<Button
	bind:this={buttonRef}
	variant="icon"
	on:click={togglePicker}
>
	<Icon size="lg" icon={smileIcon} />
</Button>

{#if pickerVisible}
	<Popper {anchor} options={{ placement:"top-end" }}>
		<div
			class="svelte-emoji-picker"
		>
			<EmojiSearch bind:searchText />
			{#if searchText}
				<EmojiSearchResults
					{searchText}
					on:emojihover={showEmojiDetails}
					on:emojiclick={onEmojiClick}
				/>
			{:else}
				<div class="svelte-emoji-picker__emoji-tabs">
					<Tabs initialSelectedIndex={1}>
						<TabList>
							<Tab><Icon icon={faHistory} /></Tab>
							{#each categoryOrder as category}
								<Tab><Icon icon={categoryIcons[category]} /></Tab>
							{/each}
						</TabList>

						<TabPanel>
							<EmojiList
								emojis={recentEmojis}
								on:emojihover={showEmojiDetails}
								on:emojiclick={onEmojiClick}
							/>
						</TabPanel>

						{#each categoryOrder as category}
							<TabPanel>
								<EmojiList
									emojis={emojiCategories[category]}
									on:emojihover={showEmojiDetails}
									on:emojiclick={onEmojiClick}
								/>
							</TabPanel>
						{/each}
					</Tabs>
				</div>
			{/if}

			{#if variantsVisible}
				<VariantPopup {variants} on:emojiclick={onVariantClick} on:close={hideVariants} />
			{/if}

			<EmojiDetail emoji={currentEmoji} />
		</div>
	</Popper>
{/if}

<style lang="postcss">
	.svelte-emoji-picker {
		background-color: rgb(255, 255, 255);
		border-bottom-left-radius: 8px;
		border-bottom-right-radius: 8px;
		border-top-left-radius: 22px;
		border-top-right-radius: 22px;
		box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px,
			rgba(255, 255, 255, 0.5) 0px 0px 0px 1px inset;
		box-sizing: border-box;
		color: rgb(28, 30, 33);
		direction: ltr;
		display: block;
		height: 313px;
		line-height: 16.08px;
		min-width: 100px;
		overflow: hidden;
		width: min-content;
		-webkit-font-smoothing: antialiased;
		padding: 2px;
	}

	:global(.svelte-emoji-picker__emoji-tabs .svelte-tabs ul.svelte-tabs__tab-list) {
		display: flex;
	}
</style>
