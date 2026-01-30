const devFallback = "http://localhost:3004";
//const prodFallback = "https://api.dokiita.com";
const prodFallback = "https://alphad.collexios.com";

const rawBase =
  import.meta?.env?.VITE_API_BASE_URL ||
  (import.meta?.env?.PROD ? devFallback : prodFallback);

const normalizedBase = (
  import.meta?.env?.PROD ? rawBase.replace(/^http:\/\//, "https://") : rawBase
)
  .replace(/\/$/, "")
  .concat("/");

const config: any = {
  mintClient: normalizedBase,
};

export default config;
