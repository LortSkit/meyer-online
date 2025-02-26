export function translateGameDoesNotExist(isDanish: boolean): string {
  return isDanish ? "Spillet eksisterer ikke" : "Game does not exist!";
}

export function translatePleaseWait(isDanish: boolean): string {
  return isDanish
    ? "Din fane er inaktiv. Vent venligst på genindlæsning eller tryk på knappen forneden:"
    : "Your tab is inactive. Please wait for the reload or press the button below:";
}

export function translateNotEnoughSpace(isDanish: boolean): string {
  return isDanish ? "Spillet er fyldt!" : "This game is full!";
}

export function translateGameInProgress(isDanish: boolean): string {
  return isDanish ? "Spillet er gået i gang!" : "Game is in progress!";
}

export function translateChooseName(isDanish: boolean): string {
  return isDanish ? "Du skal vælge et navn:" : "You have to choose a name:";
}
