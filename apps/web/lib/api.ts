export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://drivecare-api-kdzf.onrender.com";

const API_TIMEOUT_MS = 25_000;

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
  const storedSession = token ? getStoredSession() : null;
  const effectiveToken = storedSession?.accessToken ?? token;
  const response = await fetchApi(path, init, effectiveToken);

  if (response.status === 401 && token && path !== "/auth/refresh") {
    const refreshedSession = await refreshStoredSession();
    if (refreshedSession) {
      const retryResponse = await fetchApi(path, init, refreshedSession.accessToken);
      return parseApiResponse<T>(retryResponse);
    }
  }

  return parseApiResponse<T>(response);
}

async function fetchApi(path: string, init: RequestInit, token?: string) {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    return await fetch(`${API_URL}${path}`, {
      ...init,
      headers,
      cache: "no-store",
      signal: controller.signal
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        "Le serveur met trop de temps a repondre. Il est probablement en reveil sur Render gratuit. Reessayez dans quelques secondes."
      );
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function parseApiResponse<T>(response: Response): Promise<T> {
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

async function refreshStoredSession(): Promise<AuthSession | null> {
  const session = getStoredSession();
  if (!session?.refreshToken) return null;

  try {
    const response = await fetchApi(
      "/auth/refresh",
      {
        method: "POST",
        body: JSON.stringify({ refreshToken: session.refreshToken })
      },
      undefined
    );
    const refreshedSession = await parseApiResponse<AuthSession>(response);
    setStoredSession(refreshedSession);
    return refreshedSession;
  } catch {
    clearStoredSession();
    return null;
  }
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
