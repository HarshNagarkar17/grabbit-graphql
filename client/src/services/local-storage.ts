type LocalStorageKey = string;

export function setItem<T>(key: LocalStorageKey, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
  } catch {
    console.error("failed to set item");
  }
}

export function getItem<T>(key: LocalStorageKey): T | null {
  try {
    const item = window.localStorage.getItem(key);
    if (item === null) return null;
    return JSON.parse(item) as T;
  } catch {
    console.error("failed to get item");
    // Optionally log error
    return null;
  }
}

export function removeItem(key: LocalStorageKey): void {
  window.localStorage.removeItem(key);
}

export function clear(): void {
  window.localStorage.clear();
}
