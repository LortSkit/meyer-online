export function translateCurrentPlayerValueWon(
  isDanish: boolean,
  currentPlayer: number
): string {
  return isDanish
    ? `Spiller ${currentPlayer} vandt!`
    : `Player ${currentPlayer} won!`;
}

export function translateCurrentPlayerNameWon(
  isDanish: boolean,
  currentPlayer: string
): string {
  return currentPlayer + (isDanish ? ` vandt!` : ` won!`);
}

export function translateRoundTurnsTotal(
  isDanish: boolean,
  round: number,
  turnsTotal: number
): string {
  return isDanish
    ? `Der blev spillet ${round} runder, og ${turnsTotal} ture i alt`
    : `A total of ${round} rounds and ${turnsTotal} turns were played`;
}
