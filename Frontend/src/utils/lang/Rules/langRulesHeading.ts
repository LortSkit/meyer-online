import { translateRules as parentTranslate } from "../langMenuItems";

export function translateRules(isDanish: boolean): string {
  return parentTranslate(isDanish);
}
