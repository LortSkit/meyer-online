import { translateHome as parentTranslate } from "./langMenuItems";

export function translateHome(isDanish: boolean): string {
  return parentTranslate(isDanish);
}

export function translateNotFound(isDanish: boolean): string {
  return isDanish ? "Ikke fundet" : "Not found";
}

export function translate404Explanation(isDanish: boolean): string {
  return isDanish
    ? "Siden du prøvede at tilgå eksisterer ikke. Tryk på knappen forneden for at vende tilbage til forsiden."
    : "The page you tried to access does not exist. Press the button below to return to the homepage.";
}
