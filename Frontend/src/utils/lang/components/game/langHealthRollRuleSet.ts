export function translateWhen(isDanish: boolean): string {
  return isDanish
    ? "Når en spiller kommer ned på 3 liv først gang..."
    : "When a player gets down to 3 lives for the first time...";
}

export function translateCase1(isDanish: boolean): string {
  return isDanish ? "Sker der ikke noget" : "Nothing happens";
}

export function translateCase2(isDanish: boolean): string {
  return isDanish ? "Spillerens eget valg" : "The player's own choice";
}

export function translateCase3(isDanish: boolean): string {
  return isDanish
    ? "Skal de slå deres liv om"
    : "They have to reroll their health";
}
