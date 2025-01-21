export function translateRoundTurn(
  isDanish: boolean,
  round: number,
  turn: number
): string {
  return isDanish
    ? `Runde ${round}, tur ${turn}`
    : `Round ${round}, turn ${turn}`;
}

export function translateCurrentPlayerTurn(
  isDanish: boolean,
  currentPlayer: number
): string {
  return isDanish
    ? `Spiller ${currentPlayer}'s tur`
    : `Player ${currentPlayer}'s turn`;
}
