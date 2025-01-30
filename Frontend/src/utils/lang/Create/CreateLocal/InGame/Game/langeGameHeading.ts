export function translateRound(isDanish: boolean, round: number): string {
  return isDanish ? `Runde ${round}` : `Round ${round}`;
}

export function translateTurn(isDanish: boolean, turn: number): string {
  return isDanish ? `Tur ${turn}` : `Turn ${turn}`;
}

export function translateCurrentPlayerTurn(
  isDanish: boolean,
  currentPlayer: number
): string {
  return isDanish
    ? `Spiller ${currentPlayer}'s tur`
    : `Player ${currentPlayer}'s turn`;
}
