export function translateToggle(isDanish: boolean, isRight: boolean): string {
  return isDanish
    ? "Skift til " + (isRight ? "venstre" : "højre")
    : "Toggle " + (isRight ? "left" : "right");
}

export function translateWaiting(isDanish: boolean, player: string): string {
  return (
    (isDanish ? "Venter på at " : "Waiting for ") +
    player +
    (isDanish ? " afslutter sin tur" : " to finish their turn")
  );
}

export function translatePlayAgain(isDanish: boolean): string {
  return isDanish
    ? "Spil igen med samme spillere"
    : "Play again wtih the same players";
}

export function translateReopen(isDanish: boolean): string {
  return isDanish ? "Genåben lobbyen" : "Reopen lobby";
}
