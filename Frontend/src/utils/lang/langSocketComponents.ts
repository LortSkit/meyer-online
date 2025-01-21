import { translateFind } from "./langMenuItems";

export function translateReconnectFailure(isDanish: boolean): string {
  return isDanish
    ? "Du kunne ikke forbindes til vores web-socket. Du har ingen internetforbindelse eller vores server er nede. Genindlæs for at prøve igen."
    : "We are unable to connect you to the web socket. You have no internet connection or our server is down. Refresh to try again.";
}

export function translateRedirecting(isDanish: boolean): string {
  return isDanish
    ? "Ejeren har forladt spillet, omdirigerer dig til " +
        translateFind(isDanish) +
        "-siden."
    : "Game owner has left, redirecting you to the " +
        translateFind(isDanish) +
        " page.";
}
