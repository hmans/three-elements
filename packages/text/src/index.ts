import { registerElement, ThreeElement } from "three-elements"
import { Text } from "troika-three-text"

export class ThreeText extends ThreeElement.for(Text) {}

registerElement("three-text", ThreeText)
