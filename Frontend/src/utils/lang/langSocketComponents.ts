import { translateFind } from "./langMenuItems";

export function translateRedirecting(isDanish: boolean) {
  return isDanish
    ? "Ejeren har forladt spillet, omdirigerer dig til " +
        translateFind(isDanish) +
        "-siden."
    : "Game owner has left, redirecting you to the " +
        translateFind(isDanish) +
        " page.";
}
