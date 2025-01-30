export function translateCreateLocal(isDanish: boolean): string {
  return isDanish
    ? "Et lokalt spil, hvor du styrer alle spillere:"
    : "A local game where you control all the players:";
}

export function translateCreateNewLocalGame(isDanish: boolean): string {
  return isDanish ? "Opret lokalt spil!" : "Create local game!";
}

export function translateCreateOnline(isDanish: boolean): string {
  return isDanish
    ? "Online spil, hvor du spiller med andre:"
    : "Online game where you play against others:";
}

export function translateCreateNewOnlineGame(isDanish: boolean): string {
  return isDanish ? "Opret online spil!" : "Create online game!";
}
