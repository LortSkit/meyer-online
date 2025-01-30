export function translateUsersOnline(isDanish: boolean): string {
  return isDanish
    ? "Antallet af online spillere: "
    : "Number of online users: ";
}

export function translateGameId(isDanish: boolean): string {
  return isDanish ? "Spil-ID: " : "Game ID: ";
}

export function translateGameName(isDanish: boolean): string {
  return isDanish ? "Spilnavn: " : "Lobby name: ";
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
