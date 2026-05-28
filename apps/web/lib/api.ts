export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://drivecare-api-kdzf.onrender.com";

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; role: "USER" | "ADMIN" };
};

export async function apiGet<T>(path: string, token?: string): Promise<T> {
  return apiRequest<T>(path, { method: "GET" }, token);
}

export async function apiPost<T>(path: string, body: unknown, token?: string): Promise<T> {
  return apiRequest<T>(
    path,
    {
      method: "POST",
      body: JSON.stringify(body)
    },
    token
  );
}

export async function apiPatch<T>(path: string, body: unknown, token?: string): Promise<T> {
  return apiRequest<T>(
    path,
    {
      method: "PATCH",
      body: JSON.stringify(body)
    },
    token
  );
}

export async function apiRequest<T>(path: string, init: RequestInit, token?: string): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store"
  });

  if (!response.ok) {
    const text = await response.text();
    try {
      const payload = JSON.parse(text) as { error?: { message?: string; details?: { fieldErrors?: Record<string, string[]> } } };
      const fieldErrors = payload.error?.details?.fieldErrors;
      const firstFieldError = fieldErrors
        ? Object.values(fieldErrors)
            .flat()
            .find(Boolean)
        : null;
      throw new Error(firstFieldError || payload.error?.message || `API request failed: ${response.status}`);
    } catch (error) {
      if (error instanceof Error && error.message !== text) throw error;
      throw new Error(text || `API request failed: ${response.status}`);
    }
  }

  const payload = (await response.json()) as { data: T };
  return payload.data;
}

export function getStoredSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("drivecare.session");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    window.localStorage.removeItem("drivecare.session");
    return null;
  }
}

export function setStoredSession(session: AuthSession) {
  window.localStorage.setItem("drivecare.session", JSON.stringify(session));
}

export function clearStoredSession() {
  window.localStorage.removeItem("drivecare.session");
}
