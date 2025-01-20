import {
  translateCreate as parentTranslateCreate,
  translateFind as parentTranslateFind,
  translateRules as parentTranslateRules,
} from "../langMenuItems";

export function translateCreate(isDanish: boolean): string {
  return parentTranslateCreate(isDanish);
}
export function translateFind(isDanish: boolean): string {
  return parentTranslateFind(isDanish);
}
export function translateRules(isDanish: boolean): string {
  return parentTranslateRules(isDanish);
}

export function translateHomeWelcome(isDanish: boolean): string {
  return isDanish ? "Velkommen til Meyer Online!" : "Welcome to Meyer Online!";
}

export function translateHomeCreate(isDanish: boolean): string {
  return (
    (isDanish
      ? `Hvis du har lyst til at oprette et lokalt eller online spil, så navigér til `
      : `If you want to create a local or online game then navigate to the `) +
    translateCreate(isDanish) +
    translatePage(isDanish)
  );
}

export function translateHomeFind(isDanish: boolean): string {
  return (
    (isDanish
      ? `Hvis du gerne vil finde offentlige lobbyer, så navigér til `
      : `If you want to find public lobbies then navigate to the `) +
    translateFind(isDanish) +
    translatePage(isDanish)
  );
}

export function translateHomeRules(isDanish: boolean): string {
  return (
    (isDanish
      ? `Hvis du er helt lost, så klik navigér til `
      : `If you're completely lost then navigate to the `) +
    translateRules(isDanish) +
    translatePage(isDanish)
  );
}

export function translatePage(isDanish: boolean): string {
  return isDanish ? "-siden." : " page.";
}
