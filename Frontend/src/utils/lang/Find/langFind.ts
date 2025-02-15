import { translateHealthRoll as parentTranslateHealthRoll } from "../Game/GameLobby/langGameLobby";
import { translateHealthRollCases as parentTranslateHealthRollCases } from "../Game/GameLobby/langGameLobby";

export function translateUsersOnline(isDanish: boolean): string {
  return isDanish
    ? "Antallet af online spillere: "
    : "Number of online users: ";
}

export function translateGameId(isDanish: boolean): string {
  return isDanish ? "Spil-ID: " : "Game ID: ";
}

export function translatePlayers(isDanish: boolean): string {
  return isDanish ? "Spillere: " : "Players: ";
}

export function translateNoGames(isDanish: boolean): string {
  return isDanish ? "Ingen offentlige spil" : "No public games";
}

export function translateShowingFiltered(isDanish: boolean): string {
  return isDanish ? "Viser søgeresultater:" : "Showing search results:";
}

export function translateNoFiltered(isDanish: boolean): string {
  return isDanish
    ? "Ingen søgeresultater passer"
    : "No matching search results";
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
