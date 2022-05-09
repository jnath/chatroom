import {data as emojiData} from './emoji.json';
type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type EmojiData = ArrayElement<typeof emojiData>;

export default emojiData;
