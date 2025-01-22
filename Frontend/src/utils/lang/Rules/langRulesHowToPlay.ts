import { Action } from "../../gameTypes";
import { translateAction as parentTranslate } from "../Create/InGame/Game/langActionChoices";
import { translateRollName } from "../langDiceUtils";

export function translateAction(isDanish: boolean, action: Action): string {
  return parentTranslate(isDanish, action);
}

export function translateHowToPlay1(isDanish: boolean): string {
  return isDanish ? "Hvordan spiller man Meyer?" : "How to play Meyer";
}

export function translateHowToPlay2(isDanish: boolean): string {
  return isDanish
    ? "Nu når du ved forholdet mellem slagene, kan vi gå i gang med at forklare, hvordan man spiller."
    : "Now that you know the relationship between the rolls, we can jump right into explaining how to play.";
}

export function translateHowToPlay3(isDanish: boolean): string {
  return isDanish ? "Meyer spiller man på skift" : "Meyer is a turn-based game";
}

export function translateHowToPlay4(isDanish: boolean): string {
  return isDanish
    ? "Hver spiller skiftes til at have raflebægerne med terningerne i. Siden du spiller online, skal du ikke bekymre dig om, at skjule, hvad du har slået; det sørger vi for ;)"
    : "Each player takes turns to have the dice boxes with the dice inside. Since you're playing online, don't worry about hiding what you've rolled, we'll make sure no one sees ;)";
}

export function translateHowToPlay5(isDanish: boolean): string {
  return isDanish
    ? "Når det er din tur, skal du først vælge mellem de følgende muligheder:"
    : "When it's your turn, you first have to choose between the following options:";
}

export function translateHowToPlay6(isDanish: boolean): string {
  return (
    `"${translateAction(isDanish, "Check")}"` +
    (isDanish
      ? ` Vises kun som mulighed, hvis det ikke er Tur 1`
      : ` Will only be shown as an option when it's not Turn 1`)
  );
}

export function translateHowToPlay7(isDanish: boolean): string {
  return (
    `"${translateAction(isDanish, "Check")}"` +
    (isDanish
      ? " betyder at man ikke tror på, hvad den tidligere person sagde, og vil have deres slag afsløret. Det og at slå "
      : " means that you don't believe the previous person and you want their roll revealed. That and rolling ") +
    translateRollName(isDanish, 32) +
    (isDanish
      ? " er de to eneste måde en runde kan afsluttes på. En ny runde betyder, at det er Tur 1 igen. Det er den tabende person, der starter i den nye runde."
      : " are the two only ways that a round can be ended. A new round means that it's Turn 1 again. It's the losing person who goes first in the new round.")
  );
}

export function translateHowToPlay8(isDanish: boolean): string {
  return (
    (isDanish
      ? "Som sagt, så begynder en ny runde, hvis man "
      : "As explained, a new round begins when you ") +
    translateAction(isDanish, "Check") +
    (isDanish
      ? "ker. Hvis man i stedet vælger at "
      : ". If you instead decide to ") +
    translateAction(isDanish, "Roll") +
    (isDanish
      ? "le, så ville man se følgende:"
      : ", then you would see the following:")
  );
}

export function translateHowToPlay9(isDanish: boolean): string {
  return (
    `"${translateAction(isDanish, "SameRollOrHigher")}"` +
    (isDanish
      ? " Vises kun som mulighed, hvis det ikke er Tur 1"
      : " Will only be shown as an option when it's not Turn 1")
  );
}

export function translateHowToPlay10(isDanish: boolean): string {
  return (
    `"${translateAction(isDanish, "Truth")}"` +
    (isDanish
      ? " Vises kun som mulighed, hvis det er muligt at tale sandt (læs videre)"
      : " Will only be shown as an option when it's possible to be truthful (keep reading)")
  );
}

export function translateHowToPlay11(isDanish: boolean): string {
  return (
    `"${translateAction(isDanish, "SameRollOrHigher")}"` +
    (isDanish
      ? " er lidt speciel. Det betyder, at man får lov at "
      : " is a bit special. It means you're allowed to ") +
    translateAction(isDanish, "Roll") +
    (isDanish
      ? "le igen, men man får ikke lov at se, hvad man har rullet. Udover det behøver ens slag ikke at være præcis lig med det forrige 'erklærede' slag, hvis man bliver "
      : " again, but you're not allowed to see what you rolled. Furthermore, you're roll doesn't have to be equal to the previous declared roll if you get ") +
    translateAction(isDanish, "Check") +
    (isDanish
      ? "ket - blot større end lig med."
      : "ed - just greater than or equal to.")
  );
}

export function translateHowToPlay12(isDanish: boolean): string {
  return (
    (isDanish ? "Man kan altid sige " : "You can always tell the ") +
    translateAction(isDanish, "Truth") +
    (isDanish
      ? "en på Tur 1, men derefter "
      : " on Turn 1, however afterwards you ")
  );
}

export function translateHowToPlay13(isDanish: boolean): string {
  return isDanish ? "skal" : "must";
}

export function translateHowToPlay14(isDanish: boolean): string {
  return (
    (isDanish
      ? " du sige at du slog et slag større end eller lig med det forrige 'erklærede', hvilket betyder, at man nogle gange behøver at "
      : " always declare a roll greater than or equal to the previous declared roll, which means you, sometimes, have to ") +
    translateAction(isDanish, "Bluff") +
    (isDanish ? "fe eller sige " : " or say ") +
    `"${translateAction(isDanish, "SameRollOrHigher")}".`
  );
}

export function translateHowToPlay15(
  isDanish: boolean,
  exampleRoll: number
): string {
  return (
    `"${translateAction(isDanish, "Bluff")}"` +
    (isDanish
      ? " vil præsentere dig alle de valg a løgne, du kan sige. På Tur 1 kan du "
      : " will present you with all the possible lies, you can declare. On Turn 1, you can ") +
    translateAction(isDanish, "Bluff") +
    (isDanish
      ? "fe alle slag på nær dit eget (i det her tilfælde "
      : " all rolls except your own (in this case ") +
    translateRollName(isDanish, exampleRoll) +
    (isDanish
      ? "). I fremtidige ture, kan du kun sige løgne, der er større end lig med det tidligere 'erklærede'."
      : "). On future turns, you can only declare lies greater than or equal to the previous declared roll.")
  );
}

export function translateHowToPlay16(isDanish: boolean): string {
  return isDanish
    ? "Det kan være vanskeligt at forstå, hvilke mulige valg, der er, så forneden ses et interraktivt liste over, hvad der er muligt:"
    : "It can be difficult to understand which possible choices there are, so therefore an interractive list of what's possible can be seen below:";
}

export function translateHowToPlay17(isDanish: boolean): string {
  return isDanish ? "Det tidligere" : "The previous";
}

export function translateHowToPlay18(isDanish: boolean): string {
  return isDanish ? "'erklærede' slag" : "declared roll";
}

export function translateHowToPlay19(isDanish: boolean): string {
  return isDanish ? "Det nuværende slag" : "The current roll";
}

export function translateButtonNewPrevious(isDanish: boolean): string {
  return isDanish
    ? "Slå tidligere 'erklærede' slag om"
    : "Reroll previous declared roll";
}

export function translateDeletePrevious(isDanish: boolean): string {
  return isDanish ? "Slet" : "Delete";
}

export function translateButtonNewCurrent(isDanish: boolean): string {
  return isDanish ? "Slå nuværende slag om" : "Reroll current roll";
}

export function translateHowToPlay20(isDanish: boolean): string {
  return (
    (isDanish
      ? "Om end du vælger at sige "
      : "Whether you choose to tell the ") +
    translateAction(isDanish, "Truth") +
    (isDanish ? "en, at sige " : ", say ") +
    translateAction(isDanish, "SameRollOrHigher") +
    (isDanish
      ? " eller om du vælger en løgn, så slutter din Tur."
      : ", or you choose a lie, your turn ends.")
  );
}
