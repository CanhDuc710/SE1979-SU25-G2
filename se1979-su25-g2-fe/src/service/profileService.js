const API_BASE = "/api/profile";

export async function fetchProfile(userId) {
    const res = await fetch(`${API_BASE}/${userId}`);
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Fetch profile failed: ${err}`);
    }
    return res.json();
}

export async function updateProfile(userId, data) {
    const res = await fetch(`${API_BASE}/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Update profile failed: ${err}`);
    }
    return res.json();
}
