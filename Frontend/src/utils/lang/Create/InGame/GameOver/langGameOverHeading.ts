export function translateCurrentPlayer_won(
  isDanish: boolean,
  currentPlayer: number
): string {
  return isDanish
    ? `Spiller ${currentPlayer} vandt!`
    : `Player ${currentPlayer} won!`;
}

export function translateRoundTurnsTotal(
  isDanish: boolean,
  round: number,
  turnsTotal: number
): string {
  return isDanish
    ? `Der blev spillet ${round - 1} runder, og ${turnsTotal - 1} ture i alt`
    : `A total of ${round} rounds and ${turnsTotal - 1} turns were played`;
}
