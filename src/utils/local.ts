export function setLocal(key: string, value: unknown) {
  const json_str = JSON.stringify(value);
  if (json_str) {
    localStorage.setItem(key, json_str);
  }
}

export function getLocal<T = unknown>(key: string): T | null {
  const s = localStorage.getItem(key);
  if (!s) return null;
  const json = JSON.parse(s);
  if (!json) return null;
  return json;
}

export function getRawLocal(k: string) {
  return localStorage.getItem(k);
}

export function setRawLocal(k: string, v: string) {
  return localStorage.setItem(k, v);
}

export function removeLocal(key: string) {
  localStorage.removeItem(key);
}
