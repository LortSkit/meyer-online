export function isInLobby(path: string): boolean {
  return /^(\/game\/[\s\S]*)$/.test(path) || path === "/game";
}
