<script lang="ts">
  import EmojiSelector from '../../system/EmojiSelector';

  import Icon from 'svelte-fa';
	import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

  import { createEventDispatcher } from 'svelte';
  import Button from '$system/Button';

  export let value: string;

	const dispatch = createEventDispatcher();

  const send = ()=>{
    dispatch('send');
  }

  const onKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') send();
  }

  function onEmoji(event: CustomEvent) {
    value += event.detail;
  }

  export const reset = ()=>{
    value = '';
  }

  enum Styles {
    bold = "strong",
    italic = "em",
    strike = "del",
    link = "a",
    ul = "ul",
    ol = "ol",
  }

  type LinkAttributes = Record<'src',  string>;

  interface StylesAttributes {
    [Styles.bold]: unknown,
    [Styles.italic]: unknown,
    [Styles.strike]: unknown,
    [Styles.link]: LinkAttributes,
    [Styles.ul]: unknown,
    [Styles.ol]: unknown,
  }
  function getSelectedNode() {
    let node;
    let selection;

    if (getSelection) {
      selection = getSelection();
      if(selection){
        node = selection.anchorNode;
      }
    }
    if (!node && selection) {
        var range = selection.getRangeAt(0);
        node = range.commonAncestorContainer ? range.commonAncestorContainer :
               range.parentElement ? range.parentElement() : range.item(0);
    }
    if (node) {
      return (node.nodeName == "#text" ? node.parentNode : node);
    }
};
  const isSelectionInTag = (tag: string) => {
      const selection = getSelection();
      if(!selection
        || selection && selection.toString().length === 0
        || !selection.getRangeAt(0)
        ) {
        return;
      }
      // Get the current node
      // let currentNode = selection.focusNode as HTMLElement;
      // // While the node is not the editor division
      // while (currentNode.tagName !== 'editor'){
      //     // Check if the node is the requested tag
      //     if (currentNode.tagName === tag) return true;
      //     // Move up in the tree
      //     currentNode = currentNode.parentNode as HTMLElement;
      // }

      // return false;

      console.log(selection.anchorNode);
  }

  const setStyleForSelection = <S extends keyof StylesAttributes>(style: S, attributes?: StylesAttributes[S]) => {
    const selection = getSelection();
    if(!selection
      || selection && selection.toString().length === 0
      || !selection.getRangeAt(0)
      ) {
      return;
    }

    let range = selection.getRangeAt(0);

    const newElement = document.createElement(style);

    // const oldContent = document.createTextNode(range.toString());
    // const newElement = document.createElement(style);
    if(attributes){
      for (const key in attributes) {
        if (Object.prototype.hasOwnProperty.call(attributes, key)) {
          const element: string = attributes[key] as unknown as string;
          newElement.setAttribute(key, element);
        }
      }
    }

    range.surroundContents(newElement);
    // newElement.append(oldContent);

    // range.deleteContents();
    // range.insertNode(newElement);
  }

  const onBold = ()=>{
    console.log(isSelectionInTag('BOLD'))
    setStyleForSelection(Styles.bold);
  }

  const onItalic = ()=>{
    setStyleForSelection(Styles.italic);
  }

  const onStrike = ()=>{
    setStyleForSelection(Styles.strike);
  }

  const onLink = ()=>{
    const src = prompt('url')
    if(src){
      setStyleForSelection(Styles.link, { src });
    }
  }

  const onUnordonedList = ()=>{
    setStyleForSelection(Styles.ul);
  }

  const onOrdonedList = ()=>{
    setStyleForSelection(Styles.ol);
  }

</script>

<editor>
  <controls>
    <button on:click={onBold}>B</button>
    <button on:click={onItalic}>I</button>
    <button on:click={onStrike}>S</button>

    <button on:click={onLink}>L</button>
    <button on:click={onUnordonedList}>U</button>
    <button on:click={onOrdonedList}>O</button>

  </controls>
  <content
    contenteditable="true"
    on:keypress={onKeyPress}
    placeholder="Aa"
  />
  <controls>
    <EmojiSelector on:emoji={onEmoji}  />
    <Button
      variant="icon"
      style='primary'
      on:click={send}
    >
      <Icon
        size="lg"
        icon={faPaperPlane}
      />
    </Button>
  </controls>
</editor>


<style lang="postcss">
  editor {
    display: flex;
    flex-direction: column;
    padding: 5px 10px;
    gap: 10px;
    border-top: solid 1px var(--palette-divider);

    /* & > input {
      flex: 1;
    } */

    content {
      border-radius: 20px;
      border: none;
      padding: 16px;
      /* color: #1e1e1e; */
      background-color: #f3f3f5;
      /* height: 35px; */
      font-size: 18px;

      :global(a) {
        color: #2d9fd9;
      }
    }

    content:focus {
      outline: none;
      /* color: #2d9fd9; */
    }
  }
</style>
