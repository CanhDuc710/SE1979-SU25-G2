
export async function fetchAccounts({ keyword = "", status = "", role = "", page = 0, size = 20 }) {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (status) params.append("status", status);
    if (role) params.append("role", role);
    params.append("page", page);
    params.append("size", size);

    const response = await fetch(`/api/admin/accounts?${params.toString()}`);
    if (!response.ok) {
        throw new Error("Failed to fetch accounts");
    }

    return await response.json();
}
