import { translatePlayers as parentTranslate } from "../Find/langFind";

export function translatePlayers(isDanish: boolean): string {
  return parentTranslate(isDanish);
}
