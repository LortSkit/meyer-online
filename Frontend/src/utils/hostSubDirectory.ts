export const base = import.meta.env.VITE_BASE
  ? import.meta.env.VITE_BASE.startsWith("/") ||
    import.meta.env.VITE_BASE.startsWith("\\")
    ? import.meta.env.VITE_BASE
    : "/" + import.meta.env.VITE_BASE
  : "";
