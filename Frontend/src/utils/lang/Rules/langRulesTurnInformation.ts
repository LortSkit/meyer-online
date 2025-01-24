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
