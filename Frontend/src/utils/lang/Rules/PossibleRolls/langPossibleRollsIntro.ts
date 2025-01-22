export function translateRulesIntro1(isDanish: boolean): string {
  return isDanish ? "De mulige slag" : "Possible rolls";
}

export function translateRulesIntro2(isDanish: boolean): string {
  return isDanish
    ? "Terningeblufspil minder typisk om hinanden, men en ting der gør Meyer speciel er hvilke slag, man kan slå, og hvilke regler, der hører med."
    : "Liar's dice games are typically alike, but one thing that sets Meyer apart is which rolls are possible and what rules those rolls entail.";
}

export function translateRulesIntro3(isDanish: boolean): string {
  return isDanish
    ? "Forneden ses en tabel over alle slagene fra størst til mindst:"
    : "Below is a table over all the possible rolls from highest to lowest:";
}
