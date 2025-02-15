import { translateHealthRoll as parentTranslateHealthRoll } from "./GameLobby/langGameLobby";
import { translateHealthRollCases as parentTranslateHealthRollCases } from "./GameLobby/langGameLobby";

export function translateToggle(isDanish: boolean, isRight: boolean): string {
  return isDanish
    ? "Skift til " + (isRight ? "venstre" : "højre")
    : "Toggle " + (isRight ? "left" : "right");
}

export function translateWaitingTurn(
  isDanish: boolean,
  player: string
): string {
  return (
    (isDanish ? "Venter på at " : "Waiting for ") +
    player +
    (isDanish ? " afslutter sin tur" : " to finish their turn")
  );
}

export function translateWaitingOwner(
  isDanish: boolean,
  player: string
): string {
  return (
    (isDanish ? "Venter på at " : "Waiting for ") +
    player +
    (isDanish ? " starter et nyt spil" : " to start a new game")
  );
}

export function translateBack(isDanish: boolean): string {
  return isDanish ? "Tilbage" : "Back";
}

export function translatePlayAgain(isDanish: boolean): string {
  return isDanish
    ? "Spil igen med samme spillere"
    : "Play again wtih the same players";
}

export function translateReopen(isDanish: boolean): string {
  return isDanish ? "Genåben lobbyen" : "Reopen lobby";
}

export function translateHealthRoll(isDanish: boolean): string {
  return parentTranslateHealthRoll(isDanish);
}

export function translateHealthRollCases(
  isDanish: boolean,
  ruleSet: number
): string {
  return parentTranslateHealthRollCases(isDanish, ruleSet);
}
