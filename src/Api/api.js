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
    // console.error("Error fetching settings:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    let response = await api.post("/auth/logout");
    return response.data;
  } catch (error) {
    // console.error("Error logging out:", error);
    throw error;
  }
};

export const get_events = async (category_slug = null, search = null, page = null, per_page = null) => {
  try {
    const params = {};
    if (category_slug && category_slug !== "all") {
      params.category_slug = category_slug;
    }
    if (search && search !== "") {
      params.search = search;
    }
    if (page !== null) {
      params.page = page;
    }
    if (per_page !== null) {
      params.per_page = per_page;
    }
    let response = await api.get("/events", { params });
    return response.data;
  } catch (error) {
    // console.error(error);
  }
};

export const get_categories = async () => {
  try {
    let response = await api.get("/categories");
    return response.data;
  } catch (error) {
    // console.log(error);
  }
};
