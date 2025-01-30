export function isInLobby(path: string): boolean {
  return /^(\/game\/[\s\S]*)$/.test(path) || path === "/game";
}

export function isInFind(path: string): boolean {
  return path == "/find";
}
