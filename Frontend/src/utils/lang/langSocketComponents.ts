import { translateFind } from "./langMenuItems";
import { translatePage } from "./Home/langHomeText";

export function translateReconnectFailure(isDanish: boolean): string {
  return isDanish
    ? "Du kunne ikke forbindes til vores web-socket. Du har ingen internetforbindelse eller vores server er nede. Genindlæs for at prøve igen."
    : "We are unable to connect you to the web socket. You have no internet connection or our server is down. Refresh to try again.";
}

export function translateOtherTabOpened(isDanish: boolean): string {
  return (
    (isDanish
      ? "Du åbnede spillet i en anden fane. Lad venligst være med det :) "
      : "You opened the game in another tab. Please don't do that :) ") +
    translateFind(isDanish) +
    translatePage(isDanish)
  );
}

export function translateOwnerLeft(isDanish: boolean): string {
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

export function translateReloadMessage(isDanish: boolean): string {
  return isDanish
    ? "Din fane er inaktiv. For at genaktivere den, venligst genindlæs siden ved at trykke på knappen forneden:"
    : "Your tab is inactive. To reactivate it, please press the button below:";
}

export function translateReload(isDanish: boolean): string {
  return isDanish ? "Genindlæs" : "Reload";
}
