import { translateGameId as parentTranslate } from "../Find/langFind";

export function translateGameId(isDanish: boolean): string {
  return parentTranslate(isDanish);
}

export function translateShare(isDanish: boolean): string {
  return isDanish ? "Invitér andre:" : "Invite others:";
}

export function translateGameOwner(isDanish: boolean): string {
  return isDanish ? "Du er spilejeren" : "You are the game owner";
}
