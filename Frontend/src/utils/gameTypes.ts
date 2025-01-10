const possibleActions = [
  "Error",
  "Check",
  "HealthRoll",
  "Roll",
  "Cheers",
  "SameRollOrHigher",
  "Truth",
  "Bluff",
] as const;

export function isAction(x: any): x is Action {
  return possibleActions.includes(x);
}

export type Action = (typeof possibleActions)[number];

export type TurnInfoType =
  | Action
  | "CheckTT"
  | "CheckFT"
  | "CheckTF"
  | "CheckFF"
  | "CheckLoseHealth";

export type TurnInfo = [TurnInfoType, number[]];
