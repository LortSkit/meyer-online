import { translateRules as parentTranslate } from "../langMenuItems";

export function translateRulesHeading1(isDanish: boolean): string {
  return parentTranslate(isDanish);
}

export function translateRulesHeading2(isDanish: boolean): string {
  return isDanish
    ? "Meyer er et terningeblufspil."
    : "Meyer is a liar's dice game.";
}
