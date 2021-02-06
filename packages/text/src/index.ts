import { registerElement, ThreeElement } from "three-elements"
import { Text as TroikaText } from "troika-three-text"

export class ThreeText extends ThreeElement.for(TroikaText) {}

registerElement("three-text", ThreeText)
