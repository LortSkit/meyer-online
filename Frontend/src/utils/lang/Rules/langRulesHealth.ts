export function translateHealthHeading(isDanish: boolean): string {
  return isDanish ? "Spillernes liv" : "Player lives";
}

export function translateHealthText1(isDanish: boolean): string {
  return isDanish
    ? "Mens du spiller Meyer, vil spillernes liv blive visuelt repræsenteret i højresiden af skærmen, ligesom det er her."
    : "While you're playing Meyer, the players' lives will be displayed on the right side of the screen just like now.";
}

export function translateHealthText2(isDanish: boolean): string {
  return isDanish
    ? `Lige nu er der 10 tilfældige spillere, som bare har fyldnavnet "Spiller [X]". Selvfølgelig når du spiller mod rigitge spillere, kommer deres valgte navn til at stå der i stedet. `
    : `Right now there 10 random players, who just have the filler name "Player [X]". Of course, when you're playing against real players, their chosen names will be displayed instead.`;
}

export function translateHealthText3(isDanish: boolean): string {
  return isDanish
    ? "Der er en speciel regel i forhold til liv: Hvis du kommer ned på præcis 3 liv (ikke under) for første gang, "
    : "There is one special rule regarding life: If you get down to exactly 3 lives (not below) for the first time, then you ";
}

export function translateHealthText4(isDanish: boolean): string {
  return isDanish ? "skal" : "must";
}

export function translateHealthText5(isDanish: boolean): string {
  return isDanish
    ? " du slå dit liv om. Sandsynligheden er høje for, at slå 3 eller over, men du kunne være uheldig og havne på kun 1 eller 2 liv."
    : " reroll your life. There's a good chance you'll roll 3 or higher but you could be unlucky and end up at only 1 or 2 lives.";
}

export function translateHealthText6(isDanish: boolean): string {
  return isDanish
    ? "For bedre at forstå, hvordan liv fungerer i Meyer, har vi gjort nedenstående knapper interraktive:"
    : "To better understand how life works in Meyer, we made the buttons below interractive:";
}
