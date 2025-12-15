import api, { setAccessToken } from "./interceptor";

export const login = async ({ type = "username", username, email, password }) => {
  try {
    const formData = new FormData();
    if (type === "email") {
        formData.append("email", email);
    } else {
        formData.append("username", username);
    }
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

export const book_event = async (slug, ticket_type_id, quantity) => {
  try {
    // Using params to send query string as specified
    const response = await api.post(`/events/${slug}/book`, null, {
      params: { ticket_type_id, quantity },
    });
    return response.data;
  } catch (error) {
    console.error("Error booking event:", error);
    return {
      success: false,
      error: error?.response?.data?.message || error.message,
    };
  }
};

export const get_ratings = async (resource = "event", slug) => {
  try {
    const suffix = resource === "blog" ? "ratings" : "ratings";
    const response = await api.get(`/${resource}/${slug}/${suffix}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return { success: false, error: error.message };
  }
};

export const create_rating = async (resource = "event", slug, data) => {
  try {
    const suffix = resource === "blog" ? "ratings" : "ratings";
    const response = await api.post(`/${resource}/${slug}/${suffix}`, data);
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error?.response?.data?.message || error.message,
    };
  }
};

export const get_comments = async (resource, slug) => {
  try {
    const response = await api.get(`/${resource}/${slug}/comments`);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return { success: false, error: error.message };
  }
};

export const create_comment = async (resource, slug, data) => {
  try {
    const response = await api.post(`/${resource}/${slug}/comments`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating comment:", error);
    return {
      success: false,
      error: error?.response?.data?.message || error.message,
    };
  }
};

export const report_comment = async (commentId, data) => {
  try {
    const response = await api.post(`/comments/${commentId}/report`, data);
    return response.data;
  } catch (error) {
    console.error("Error reporting comment:", error);
    return {
      success: false,
      error: error?.response?.data?.message || error.message,
    };
  }
};
