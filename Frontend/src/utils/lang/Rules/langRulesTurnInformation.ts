import { TurnInfo } from "../../gameTypes";
import { translateTurnInfo as parentTranslate } from "../game/TurnInformation/langTurnInformationDisplay";

export function translateTurnInfo(
  isDanish: boolean,
  turnInfo: TurnInfo
): string {
  return parentTranslate(isDanish, turnInfo);
}

export function translateTurnInformation(isDanish: boolean): string {
  return isDanish ? "Turinformation" : "Turn information";
}

export function translateTurnInformationText1(isDanish: boolean): string {
  return isDanish
    ? "Hver gang nogen tager en handling, bliver alle spillere informeret via nogle knapper med tekst på. De har en timer på, så hvis du ikke følger med i, hvad der sker, så er det bare ærgeligt."
    : "Everytime someone takes an action then all players will be informed through buttons with text on them. Each button has a timer so if you're not paying attention then that's just too bad.";
}

export function translateTurnInformationText2(isDanish: boolean): string {
  return isDanish
    ? `Hvis du vil se alle de mulige turinformationsbesker, der er, så klik på knappen forneden (men klik på også på alle knapper der siger "KLIK HER!" først :)`
    : `If you want to see all the possible turn information messages, then click on the button below (but click on all buttons saying "CLICK HERE!" first :)`;
}

export function translateShow(isDanish: boolean): string {
  return isDanish ? "Vis" : "Show";
}
