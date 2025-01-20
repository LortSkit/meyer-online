export function translateCreateLocal(isDanish: boolean): string {
  return isDanish
    ? "Et lokalt spil, hvor du styrer alle spillere:"
    : "A local game where you control all the players:";
}

export function translateCreateNewGame(isDanish: boolean): string {
  return isDanish ? "Opret lokalt spil!" : "Create local game!";
}

export function translateCreateOnline(isDanish: boolean): string {
  return isDanish
    ? "Online spil, hvor du spiller med andre:"
    : "Online game where you play against others:";
}

export function translateCreatePublic(isDanish: boolean): string {
  return isDanish ? "Opret offentligt spil!" : "Create public game!";
}

export function translateCreatePrivate(isDanish: boolean): string {
  return isDanish ? "Opret privat spil!" : "Create private game!";
}
