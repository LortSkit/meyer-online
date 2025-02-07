import { translateFind } from "./langMenuItems";
import { translatePage } from "./Home/langHomeText";

export function translateReconnectFailure(isDanish: boolean): string {
  return isDanish
    ? "Du kunne ikke forbindes til vores web-socket. Du har ingen internetforbindelse eller vores server er nede. Genindlæs for at prøve igen."
    : "We are unable to connect you to the web socket. You have no internet connection or our server is down. Refresh to try again.";
}

export function translateRedirecting(isDanish: boolean): string {
  return (
    (isDanish
      ? "Ejeren har forladt spillet. Vi har omdirigeret dig til "
      : "Game owner has left. We have redirected you to ") +
    translateFind(isDanish) +
    translatePage(isDanish)
  );
}

export function translateKicked(isDanish: boolean): string {
  return (
    (isDanish
      ? "Ejeren har smidt dig ud af spillet... Vi har omdirigeret dig til "
      : "Owner kicked you from the game... We have redirected you to ") +
    translateFind(isDanish) +
    translatePage(isDanish)
  );
}

export function translateLoading(isDanish: boolean): string {
  return isDanish
    ? "Forbinder dig til serveren..."
    : "Connecting you to server...";
}
