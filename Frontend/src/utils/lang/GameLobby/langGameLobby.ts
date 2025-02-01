import { translateGameId as parentTranslate } from "../Find/langFind";

export function translateGameDoesNotExist(isDanish: boolean): string {
  return isDanish ? "Spillet eksisterer ikke" : "Game does not exist!";
}

export function translateNotEnoughSpace(isDanish: boolean): string {
  return isDanish ? "Spillet er fyldt!" : "This game is full!";
}

export function translateChooseName(isDanish: boolean): string {
  return isDanish ? "Du skal vælge et navn:" : "You have to choose a name:";
}

export function translateGameId(isDanish: boolean): string {
  return parentTranslate(isDanish);
}

export function translateShare(isDanish: boolean): string {
  return isDanish ? "Invitér andre:" : "Invite others:";
}

export function translateGameOwner(isDanish: boolean): string {
  return isDanish ? "Du er spilejeren" : "You are the game owner";
}
