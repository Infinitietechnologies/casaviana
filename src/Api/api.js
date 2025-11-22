import api, { setAccessToken } from "./interceptor";

export const login = async ({ type = "username", username, password }) => {
  try {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("type", type);


    // Await the response here
    let response = await api.post("/auth/login", formData);
    setAccessToken(response.data.token);
    return response.data;
    
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    let response = await api.post("/auth/logout");
    return response.data;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};
