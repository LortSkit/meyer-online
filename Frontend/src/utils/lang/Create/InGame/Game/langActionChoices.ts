import { Action } from "../../../../gameTypes";

export function translateAction(isDanish: boolean, action: Action): string {
  const translateActionsMap: { [action: string]: string } = {
    ["Error"]: isDanish ? "FEJL!" : "ERROR!",
    ["Check"]: isDanish ? "Tjek" : "Check",
    ["HealthRoll"]: isDanish ? "Rul nyt liv" : "Roll new health",
    ["Roll"]: isDanish ? "Rul" : "Roll",
    ["Cheers"]: isDanish ? "SKÅL!" : "CHEERS!",
    ["SameRollOrHigher"]: isDanish
      ? "Dét eller derover"
      : "Same roll or higher",
    ["Truth"]: isDanish ? "Sandhed" : "Truth",
    ["Bluff"]: isDanish ? "Bluf" : "Bluff",
  };

  return translateActionsMap[action];
}
