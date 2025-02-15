import { translateGameId as parentTranslateGameId } from "../../Find/langFind";
import {
  translateCase1,
  translateCase2,
  translateCase3,
} from "../../components/game/langHealthRollRuleSet";
import { translateAction } from "../../components/game/langActionChoices";

export function translateGameDoesNotExist(isDanish: boolean): string {
  return isDanish ? "Spillet eksisterer ikke" : "Game does not exist!";
}

export function translateNotEnoughSpace(isDanish: boolean): string {
  return isDanish ? "Spillet er fyldt!" : "This game is full!";
}

export function translateGameInProgress(isDanish: boolean): string {
  return isDanish ? "Spillet er gået i gang!" : "Game is in progress!";
}

export function translateChooseName(isDanish: boolean): string {
  return isDanish ? "Du skal vælge et navn:" : "You have to choose a name:";
}

export function translateGameId(isDanish: boolean): string {
  return parentTranslateGameId(isDanish);
}

export function translateShare(isDanish: boolean): string {
  return isDanish ? "Invitér andre:" : "Invite others:";
}

export function translateGameOwner(isDanish: boolean): string {
  return isDanish ? "Du er spilejeren" : "You are the game owner";
}

export function translateNeedPlayers(isDanish: boolean): string {
  return isDanish
    ? "Mindst 2 spillere er krævet før start!"
    : "At least 2 players are needed to start!";
}

export function translateNeedName(isDanish: boolean): string {
  return isDanish
    ? "Alle spillere skal ha' et navn før start!"
    : "All players need a name to start!";
}

export function translateStartGame(isDanish: boolean): string {
  return isDanish ? "Start Spillet!" : "Start Game!";
}

export function translateWaiting(isDanish: boolean): string {
  return isDanish
    ? "Venter på at spilejeren starter"
    : "Waiting for game owner to start";
}

export function translateHealthRoll(isDanish: boolean): string {
  return translateAction(isDanish, "HealthRoll");
}

export function translateHealthRollCases(
  isDanish: boolean,
  ruleSet: number
): string {
  if (ruleSet === 0) {
    return translateCase1(isDanish);
  } else if (ruleSet === 1) {
    return translateCase2(isDanish);
  } else {
    return translateCase3(isDanish);
  }
}
