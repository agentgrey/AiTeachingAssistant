const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export async function postRequest<T>(endpoint: string, body: any): Promise<T> {
  try {
    const PATH = `${BASE_URL}/api${endpoint}`;
    // console.log('PATH: ', PATH);

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const res = await fetch(PATH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    // console.log('res: ', res);

    if (!res.ok) {
      const errorData = await res.json();

      if (errorData.message === "No token provided" || errorData.message === "Invalid or expired token") {
        console.warn("Session expired, logging out...");
        localStorage.removeItem('token'); 
        window.location.href = "/login";  
      }

      throw new Error(errorData.message || "Something went wrong");
    }

    return await res.json();
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getRequest<T>(endpoint: string): Promise<T> {
  try {
    const PATH = `${BASE_URL}/api${endpoint}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const res = await fetch(PATH, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) {
      const errorData = await res.json();

      if (errorData.message === "No token provided" || errorData.message === "Invalid or expired token") {
        console.warn("Session expired, logging out...");
        localStorage.removeItem('token');
        window.location.href = "/login";
      }

      throw new Error(errorData.message || "Something went wrong");
    }

    return await res.json();
  } catch (error: any) {
    throw new Error(error.message);
  }
}
