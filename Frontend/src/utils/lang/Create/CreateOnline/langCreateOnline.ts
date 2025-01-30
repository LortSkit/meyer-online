export function translateMaxNumberOfPlayers(isDanish: boolean): string {
  return isDanish
    ? "Max antal spillere (20 hvis ikke udfyldt):"
    : "Max number of players (20 if unspecified):";
}

export function translateLobbyName(isDanish: boolean): string {
  return isDanish ? "Spillets navn (skal udfyldes):" : "Lobby name (required):";
}

export function translateCreatePublic(isDanish: boolean): string {
  return isDanish ? "Opret offentligt spil!" : "Create public game!";
}

export function translateCreatePrivate(isDanish: boolean): string {
  return isDanish ? "Opret privat spil!" : "Create private game!";
}
