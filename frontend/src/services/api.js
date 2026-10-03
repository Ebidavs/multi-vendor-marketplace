const API_URL = "https://multi-vendor-marketplace-kt9n.onrender.com";

export const registerUser = async (userData) => {
    const response = await
    fetch(`${API_URL}/api/v1/auth/register`, {
        method: "POST" ,
        headers: {
            "Content-Type": "application.json",
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Registration failed");
    }
    return data;
};

export const loginUser = async (userData) => {
    const response = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Login failed")
    }
    return data;
};
 export const forgotPassword = async (email) => {
    const response = await fetch(
        `${API_URL}/api/v1/auth/forgot-password`,{
            method: "POST" ,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email }),
        }
        
    );
    const data = await response.json();
    if (!response.ok) {
        throw new
        Error(data.message || "Failed tpo send reset link");
    }
    return data;
 };