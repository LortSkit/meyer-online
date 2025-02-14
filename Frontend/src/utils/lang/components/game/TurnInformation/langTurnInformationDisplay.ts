import { isAction, TurnInfo } from "../../../../gameTypes";
import { translateRollName } from "../../../langDiceUtils";
import { danishGenitiveEnding } from "../langeGameHeading";

export function translateTurnInfo(
  isDanish: boolean,
  turnInfo: TurnInfo,
  playerNames?: string[]
): string {
  let currentPlayer: number | string = -1;
  let bluff = -1;
  let healthRoll = -1;
  let healthToLose = -1;
  let previousDeclaredRoll = -1;
  let previousPlayer: number | string = -1;
  let previousRoll = -1;
  let roll = -1;

  if (isAction(turnInfo[0])) {
    currentPlayer = playerNames
      ? playerNames[turnInfo[1][0] - 1]
      : turnInfo[1][0];
  } else {
    previousPlayer = playerNames
      ? playerNames[turnInfo[1][0] - 1]
      : turnInfo[1][0];
    previousDeclaredRoll = turnInfo[1][1];
    previousRoll = turnInfo[1][2];
  }

  function translatePlayer(isDanish: boolean, isNumber: boolean): string {
    return isNumber ? (isDanish ? "Spiller " : "Player ") : "";
  }

  switch (turnInfo[0]) {
    case "Error":
      throw new Error("This SHOULD be unreachable");

    case "Check":
      previousPlayer = playerNames
        ? playerNames[turnInfo[1][1] - 1]
        : turnInfo[1][1];
      return (
        translatePlayer(isDanish, typeof currentPlayer === "number") +
        (isDanish
          ? `${currentPlayer} valgte at tjekke `
          : `${currentPlayer} chose to check `) +
        translatePlayer(isDanish, typeof currentPlayer === "number") +
        (isDanish
          ? `${
              previousPlayer +
              (typeof previousPlayer === "string"
                ? danishGenitiveEnding(previousPlayer)
                : "'s")
            } slag...`
          : `${previousPlayer}'s roll...`)
      );

    case "CheckTT":
      return (
        translatePlayer(isDanish, typeof previousPlayer === "number") +
        (isDanish
          ? `${previousPlayer} sagde "Dét eller derover" og skulle derfor rulle mindst ${translateRollName(
              isDanish,
              previousDeclaredRoll
            )}, og deres slag var ${translateRollName(isDanish, previousRoll)}${
              previousRoll == 32 ? "! Det skal fejres!" : ""
            }`
          : `${previousPlayer} had declared "Same roll or higher" and had to roll at least ${translateRollName(
              isDanish,
              previousDeclaredRoll
            )} and their roll was ${translateRollName(isDanish, previousRoll)}${
              previousRoll == 32 ? "! That's cause for celebration!" : ""
            }`)
      );

    case "CheckFT":
      return (
        translatePlayer(isDanish, typeof previousPlayer === "number") +
        (isDanish
          ? `${previousPlayer} sagde, de slog ${translateRollName(
              isDanish,
              previousDeclaredRoll
            )}, og deres slag var virkelig ${translateRollName(
              isDanish,
              previousRoll
            )}`
          : `${previousPlayer} had declared ${translateRollName(
              isDanish,
              previousDeclaredRoll
            )} and their roll was indeed ${translateRollName(
              isDanish,
              previousRoll
            )}`)
      );

    case "CheckTF":
      return (
        translatePlayer(isDanish, typeof previousPlayer === "number") +
        (isDanish
          ? `${previousPlayer} sagde "Dét eller derover" og skulle derfor rulle mindst ${translateRollName(
              isDanish,
              previousDeclaredRoll
            )}, men deres slag var kun ${translateRollName(
              isDanish,
              previousRoll
            )}...`
          : `${previousPlayer} had declared "Same roll or higher" and had to roll at least ${translateRollName(
              isDanish,
              previousDeclaredRoll
            )} but their roll was only ${translateRollName(
              isDanish,
              previousRoll
            )}...`)
      );

    case "CheckFF":
      return (
        translatePlayer(isDanish, typeof previousPlayer === "number") +
        (isDanish
          ? `${previousPlayer} sagde, de slog ${translateRollName(
              isDanish,
              previousDeclaredRoll
            )}, og deres slag var i virkeligheden ${translateRollName(
              isDanish,
              previousRoll
            )}`
          : `${previousPlayer} had declared ${translateRollName(
              isDanish,
              previousDeclaredRoll
            )} and their roll was actually ${translateRollName(
              isDanish,
              previousRoll
            )}`)
      );

    case "CheckLoseHealth":
      let losingPlayer = playerNames
        ? playerNames[turnInfo[1][0] - 1]
        : turnInfo[1][0];
      healthToLose = turnInfo[1][1];
      return (
        translatePlayer(isDanish, typeof losingPlayer === "number") +
        (isDanish
          ? `${losingPlayer} mistede ${healthToLose} liv`
          : `${losingPlayer} lost ${healthToLose} ${
              healthToLose > 1 ? "lives" : "life"
            }`)
      );

    case "HealthRoll":
      healthRoll = turnInfo[1][1];
      return (
        translatePlayer(isDanish, typeof currentPlayer === "number") +
        (isDanish
          ? `${currentPlayer} rullede deres liv af værdi 3 om til ${healthRoll}`
          : `${currentPlayer} rolled their health of 3 into ${healthRoll}`)
      );

    case "Roll":
      return (
        translatePlayer(isDanish, typeof currentPlayer === "number") +
        (isDanish
          ? `${currentPlayer} valgte at rulle...`
          : `${currentPlayer} chose to roll...`)
      );

    case "Cheers":
      return (
        translatePlayer(isDanish, typeof currentPlayer === "number") +
        (isDanish
          ? `${currentPlayer} sagde "Skål!"`
          : `${currentPlayer} said "Cheers!"`)
      );

    case "SameRollOrHigher":
      return (
        translatePlayer(isDanish, typeof currentPlayer === "number") +
        (isDanish
          ? `${currentPlayer} sagde "Dét eller derover"`
          : `${currentPlayer} declared "Same roll or higher"`)
      );

    case "Truth":
      roll = turnInfo[1][1];
      return (
        translatePlayer(isDanish, typeof currentPlayer === "number") +
        (isDanish
          ? `${currentPlayer} sagde, de slog ${translateRollName(
              isDanish,
              roll
            )}`
          : `${currentPlayer} declared ${translateRollName(isDanish, roll)}`)
      );

    case "Bluff":
      bluff = turnInfo[1][1];
      return (
        translatePlayer(isDanish, typeof currentPlayer === "number") +
        (isDanish
          ? `${currentPlayer} sagde, de slog ${translateRollName(
              isDanish,
              bluff
            )}`
          : `${currentPlayer} declared ${translateRollName(isDanish, bluff)}`)
      );
  }
}
