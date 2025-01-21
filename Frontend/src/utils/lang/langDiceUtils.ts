import { isGreaterThanEqualTo } from "../gameLogic";

export function translateRollName(isDanish: boolean, roll: number): string {
  if (isGreaterThanEqualTo(roll, 11)) {
    if (isGreaterThanEqualTo(roll, 31)) {
      switch (roll) {
        case 21:
          return "Meyer";

        case 31:
          return isDanish ? "Lille Meyer" : "Little Meyer";

        case 32:
          return isDanish ? "Fællesskål" : "Roll of Cheers";
      }
    } else {
      return isDanish ? `Par ${roll % 10}` : `Pair of ${roll % 10}'s`;
    }
  } else {
    return `${roll}`;
  }
  return "UNREACHABLE";
}
