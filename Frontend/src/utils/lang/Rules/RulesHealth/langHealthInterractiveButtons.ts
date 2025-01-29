import { Action } from "../../../gameTypes";
import { translateAction as parentTranslate } from "../../game/langActionChoices";

export function translateClickMePlease(isDanish: boolean): string {
  return isDanish ? "KLIK HER!" : "CLICK HERE!";
}

export function translateRemoveHealth(isDanish: boolean): string {
  return isDanish ? "Fjern liv" : "Remove life";
}

export function translateAction(isDanish: boolean, action: Action): string {
  return parentTranslate(isDanish, action);
}

export function translateReset(isDanish: boolean): string {
  return isDanish ? "Nulstil" : "Reset";
}
