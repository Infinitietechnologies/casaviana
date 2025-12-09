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

export const get_events = async (
  category_slug = null,
  search = null,
  page = null,
  per_page = null
) => {
  try {
    const params = {
      ...(category_slug && category_slug !== "all" && { category_slug }),
      ...(search && { search }),
      ...(page !== null && { page }),
      ...(per_page !== null && { per_page }),
      sort_order: "desc",
    };

    const response = await api.get("/events", { params });
    return response.data;
  } catch (error) {
    // console.error(error);
  }
};

export const get_event = async (slug) => {
  try {
    const response = await api.get(`/events/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching event:", error);
    return { success: false, error: error.message };
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

export const get_blogs = async (
  category_id = null,
  search = null,
  page = null,
  per_page = null
) => {
  try {
    const params = {
      ...(category_id && { category_id }),
      ...(search && { search }),
      ...(page !== null && { page }),
      ...(per_page !== null && { per_page }),
      sort_order: "desc",
    };

    const response = await api.get("/blogs", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return { success: false, error: error.message };
  }
};

export const get_blog = async (slug) => {
  try {
    const response = await api.get(`/blogs/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return { success: false, error: error.message };
  }
};

export const get_restaurant_categories = async () => {
  try {
    const response = await api.get("/categories/restaurant-categories", {
      params: { include: "children" },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurant categories:", error);
    return { success: false, error: error.message };
  }
};

export const get_menu_items = async (category_id = null) => {
  try {
    const params = {};
    if (category_id) {
      params.category_id = category_id;
    }
    const response = await api.get("/menu-items", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return { success: false, error: error.message };
  }
};