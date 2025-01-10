export function translatePlayerIndex(isDanish: boolean, index: number): string {
  return isDanish ? `Spiller ${index + 1}: ` : `Player ${index + 1}: `;
}
