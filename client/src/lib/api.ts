const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function loginToBackend(userId: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) throw new Error("Login failed");
  } catch (err) {
    console.error("Login error:", err);
  }
}

export async function logoutFromBackend() {
  try {
    await fetch(`${BACKEND_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    window.location.reload();
  } catch (err) {
    console.error("Logout error:", err);
  }
}
