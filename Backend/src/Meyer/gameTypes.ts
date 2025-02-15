const possibleActions = [
  "Error",
  "Check",
  "Continue",
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

export type MeyerInfo = {
  round: number;
  turn: number;
  turnTotal: number;
  isGameOver: boolean;
  healths: number[];
  currentPlayer: string;
  roll: number;
  actionChoices: Action[];
  bluffChoices: number[];
  turnInformation: TurnInfo[];
};

export const MeyerInfoDefault: MeyerInfo = {
  round: 1,
  turn: 1,
  turnTotal: 1,
  isGameOver: false,
  healths: [],
  currentPlayer: "",
  roll: -1,
  actionChoices: [],
  bluffChoices: [],
  turnInformation: [],
};
