import { translateRollName } from "../../langDiceUtils";

export function translateCheers1(isDanish: boolean): string {
  return isDanish
    ? "Alle skåler! Efterfølgende starter der en ny runde, hvor personen, som slog dette slag, starter."
    : "Everyone cheers! Afterwards, a new round start where the person who rolled this roll starts.";
}

export function translateCheers2(isDanish: boolean): string {
  return isDanish
    ? "(Det eneste slag, der afslutter runden)"
    : "(The only roll that causes the round to end)";
}

export function translateMeyer1(isDanish: boolean): string {
  return isDanish
    ? `Det højeste slag, der i modsætning til ${translateRollName(
        isDanish,
        32
      )}s-slaget `
    : `The highest roll, which unlike the ${translateRollName(isDanish, 32)} `;
}

export function translateMeyerBold(isDanish: boolean): string {
  return isDanish ? "ikke" : "doesn't";
}

export function translateMeyer2(isDanish: boolean): string {
  return isDanish ? " afslutter runden." : " end the round.";
}

export function translateMeyer3(isDanish: boolean): string {
  return isDanish
    ? `Hvis man siger, man slog ${translateRollName(
        isDanish,
        21
      )}, men man bliver opdaget, ville man miste 2 liv i stedet for kun 1, som man ville i alle andre tilfælde, og ligeledes ville den anden person miste 2 liv, hvis man talte sandt.`
    : `If you say you roll a ${translateRollName(
        isDanish,
        21
      )} but you get caught red-handed, then you would lose 2 lives instead of just the 1 as you would in every other case, and likewise the other person would lose 2 lives if you told the truth.`;
}

export function translateLittleMeyer(isDanish: boolean): string {
  return isDanish
    ? "Et sødt navn til et godt slag. Det er blot det næsthøjeste slag. Ingen specielle regler."
    : "A cute name for a good roll. It's simply just the second highest roll. No special rules.";
}

export function translatePairs1(isDanish: boolean): string {
  return isDanish
    ? "De højeste ikke-specielle slag."
    : "The highest non-special rolls.";
}

export function translatePairs2(isDanish: boolean): string {
  return (
    "(" +
    translateRollName(isDanish, 66) +
    (isDanish ? " er højest)" : " is highest)")
  );
}

export function translateBoring1(isDanish: boolean): string {
  return isDanish ? "De værste slag." : "The worst rolls.";
}

export function translateBoring2(isDanish: boolean): string {
  return (
    "(" +
    translateRollName(isDanish, 41) +
    (isDanish ? " er det allerlaveste slag)" : " is lowest roll in the game)")
  );
}
