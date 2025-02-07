export function translateRound(isDanish: boolean, round: number): string {
  return isDanish ? `Runde ${round}` : `Round ${round}`;
}

export function translateTurn(isDanish: boolean, turn: number): string {
  return isDanish ? `Tur ${turn}` : `Turn ${turn}`;
}

export function translateCurrentPlayerValueTurn(
  isDanish: boolean,
  currentPlayer: number
): string {
  return isDanish
    ? `Spiller ${currentPlayer}'s tur`
    : `Player ${currentPlayer}'s turn`;
}

export function danishGenitiveEnding(word: string): string {
  if (
    word &&
    (word.endsWith("s") || word.endsWith("x") || word.endsWith("z"))
  ) {
    return "'";
  }
  return "s";
}

export function translateCurrentPlayerNameTurn(
  isDanish: boolean,
  currentPlayer: string
): string {
  return isDanish ? danishGenitiveEnding(currentPlayer) + ` tur` : `'s turn`;
}
