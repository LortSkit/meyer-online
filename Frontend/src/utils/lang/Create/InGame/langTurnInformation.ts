import { isAction, TurnInfo } from "../../../gameTypes";

export function translateTurnInfo(
  isDanish: boolean,
  turnInfo: TurnInfo
): string {
  let currentPlayer = -1;
  let bluff = -1;
  let healthRoll = -1;
  let healthToLose = -1;
  let previousDeclaredRoll = -1;
  let previousPlayer = -1;
  let previousRoll = -1;
  let roll = -1;

  if (isAction(turnInfo[0])) {
    currentPlayer = turnInfo[1][0];
  } else {
    previousPlayer = turnInfo[1][0];
    previousDeclaredRoll = turnInfo[1][1];
    previousRoll = turnInfo[1][2];
  }

  switch (turnInfo[0]) {
    case "Error":
      throw new Error("This could SHOULD be unreachable");

    case "Check":
      previousPlayer = turnInfo[1][1];
      return isDanish
        ? `Spiller ${currentPlayer} valgte at tjekke Spiller ${previousPlayer}'s slag...`
        : `Player ${currentPlayer} chose to check Player ${previousPlayer}'s roll...`;

    case "CheckTT":
      return isDanish
        ? `Spiller ${previousPlayer} sagde "Dét eller derover" og skulle derfor rulle mindst ${previousDeclaredRoll}, og deres rul var ${previousRoll}${
            previousRoll == 32 ? "!" : ""
          }`
        : `Player ${previousPlayer} had declared "Same roll or higher" and had to roll at least ${previousDeclaredRoll} and their roll was ${previousRoll}${
            previousRoll == 32 ? "!" : ""
          }`;

    case "CheckFT":
      return isDanish
        ? `Spiller ${previousPlayer} sagde, de slog ${previousDeclaredRoll}, og deres slag var virkelig ${previousRoll}`
        : `Player ${previousPlayer} had declared ${previousDeclaredRoll} and their roll was indeed ${previousRoll}`;

    case "CheckTF":
      return isDanish
        ? `Spiller ${previousPlayer} sagde "Dét eller derover" og skulle derfor rulle mindst ${previousDeclaredRoll}, men deres rul var kun ${previousRoll}...`
        : `Player ${previousPlayer} had declared "Same roll or higher" and had to roll at least ${previousDeclaredRoll} but their roll was only ${previousRoll}...`;

    case "CheckFF":
      return isDanish
        ? `Spiller ${previousPlayer} sagde, de slog ${previousDeclaredRoll}, og deres slag var virkelig ${previousRoll}`
        : `Player ${previousPlayer} had declared ${previousDeclaredRoll} and their roll was actually ${previousRoll}`;

    case "CheckLoseHealth":
      let losingPlayer = turnInfo[1][0];
      healthToLose = turnInfo[1][1];
      return isDanish
        ? `Spiller ${losingPlayer} mistede ${healthToLose} liv`
        : `Player ${losingPlayer} lost ${healthToLose} ${
            healthToLose > 1 ? "lives" : "life"
          }`;

    case "HealthRoll":
      healthRoll = turnInfo[1][1];
      return isDanish
        ? `Spiller ${currentPlayer} rullede deres liv af værdi 3 om til ${healthRoll}`
        : `Player ${currentPlayer} rolled their health of 3 into ${healthRoll}`;

    case "Roll":
      return isDanish
        ? `Spiller ${currentPlayer} valgte at rulle...`
        : `Player ${currentPlayer} chose to roll...`;

    case "Cheers":
      return isDanish
        ? `Spiller ${currentPlayer} sagde "Skål!"`
        : `Player ${currentPlayer} said "Cheers!"`;

    case "SameRollOrHigher":
      return isDanish
        ? `Spiller ${currentPlayer} sagde "Dét eller derover"`
        : `Player ${currentPlayer} declared "Same roll or higher"`;

    case "Truth":
      roll = turnInfo[1][1];
      return isDanish
        ? `Spiller ${currentPlayer} sagde, de slog ${roll}`
        : `Player ${currentPlayer} declared ${roll}`;

    case "Bluff":
      bluff = turnInfo[1][1];
      return isDanish
        ? `Spiller ${currentPlayer} sagde, de slog ${bluff}`
        : `Player ${currentPlayer} declared ${bluff}`;
  }
}
