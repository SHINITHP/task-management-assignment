import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // for using cookies
});

// request interceptor to attach accessToken - no need to attach it everytime
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// response interceptor to refresh token on 401 - if any error comes
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 && error.response.data.message === 'Invalid or expired refresh token' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // call the refresh token :
        const res = await axios.post(
          "http://localhost:5000/api/auth/refresh-token",
          {},
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log(res)
        localStorage.setItem("accessToken", res.data.accessToken);
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${res.data.accessToken}`;
        return api(originalRequest);
      } catch (error) {
        console.error("Refresh token failed", error);
        localStorage.removeItem("accessToken");
        window.location.href = "/?authMode=sign-in"; // redirect to login
      }
    }
    return Promise.reject(error);
  }
);

export default api;
