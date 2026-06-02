import toast from 'react-hot-toast';

const BASE_URL = "http://localhost:8080";

export const api = async (endpoint, method = "GET", body = null) => {
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json",
        // Adding Accept header to tell Spring we want JSON
        "Accept": "application/json",
    };

    if (token) headers["Authorization"] = `Bearer ${token}`;

    const config = {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    };

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);

        // 1. Handle Token Expiration
        if (response.status === 401) {
            localStorage.clear();
            window.location.href = "/login";
            return;
        }

        // 2. Safely parse data regardless of success or error
        const contentType = response.headers.get("content-type");
        let data;
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        // 3. Handle non-200 responses
        if (!response.ok) {
            // Extract error message from JSON object or plain text
            const errorMsg = data?.message || (typeof data === 'string' ? data : response.statusText);
            throw new Error(errorMsg || "Something went wrong");
        }

        return data;

    } catch (error) {
        // Display error to user via toast
        toast.error(error.message);
        throw error;
    }
};