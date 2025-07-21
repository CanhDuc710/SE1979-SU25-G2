export const authFetch = (url, options = {}) => {
    const token = localStorage.getItem("token");

    const defaultHeaders = {
        Authorization: token,
        "Content-Type": "application/json",
    };

    return fetch(url, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...(options.headers || {}),
        },
    });
};
