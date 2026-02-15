export function isInLobby(path: string): boolean {
  return /^(\/game\/[\s\S]*)$/.test(path) || path === "/game";
}

export function isInFind(path: string): boolean {
  return path == "/find";
}

export function is404(path: string): boolean {
  return (
    !isInLobby(path) &&
    !isInFind(path) &&
    path !== "/game" &&
    path !== "/create" &&
    path !== "/rules" &&
    path !== "/"
  );
}
