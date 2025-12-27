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

export const register = async ({ name, email, phone, password, password_confirmation }) => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("password_confirmation", password_confirmation);

    let response = await api.post("/auth/register", formData);
    setAccessToken(response.data.token);
    return response.data;
  } catch (error) {
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

export const get_menus = async () => {
  try {
    const response = await api.get("/menus");
    return response.data;
  } catch (error) {
    console.error("Error fetching menus:", error);
    return { success: false, error: error.message };
  }
};

export const get_menu_details = async (slug) => {
  try {
    const response = await api.get(`/menus/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching menu details:", error);
    return { success: false, error: error.message };
  }
};

export const get_menu_items = async (category_id = null, menu_id = null) => {
  try {
    const params = {};
    if (category_id) {
      params.category_id = category_id;
    }
    if (menu_id) {
      params.menu_id = menu_id;
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
export const get_content_sections = async () => {
  try {
    const response = await api.get("/content-sections");
    return response.data;
  } catch (error) {
    console.error("Error fetching content sections:", error);
    return { success: false, error: error.message };
  }
};

export const update_profile = async ({ name, email, phone, profile_picture }) => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    
    // Only append profile_picture if it's a File object
    if (profile_picture instanceof File) {
      formData.append("profile_picture", profile_picture);
    }

    const response = await api.post("/auth/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      error: error?.response?.data?.message || error.message,
    };
  }
};

// In your Api/api.js file, add:
export const get_system_settings = async () => {
  try {
    const response = await api.get("/system-settings");
    return response.data;
  } catch (error) {
    console.error("Error fetching system settings:", error);
    return { success: false, error: error.message };
  }
};

export const get_payments = async () => {
  try {
    const response = await api.get("/payments/list");
    return response.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    return { success: false, error: error.message };
  }
};

export const initiate_payment = async ({ payable_type, payable_id, gateway }) => {
  try {
    const formData = new FormData();
    formData.append("payable_type", payable_type);
    formData.append("payable_id", payable_id);
    formData.append("gateway", gateway);

    const response = await api.post("/payments/initiate", formData);
    return response.data;
  } catch (error) {
    console.error("Error initiating payment:", error);
    return {
      success: false,
      error: error?.response?.data?.message || error.message,
    };
  }
};

export const upload_payment_proof = async (payment_id, proof_file) => {
  try {
    const formData = new FormData();
    formData.append("proof", proof_file);

    const response = await api.post(`/payments/${payment_id}/proof`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading payment proof:", error);
    return {
      success: false,
      error: error?.response?.data?.message || error.message,
    };
  }
};

export const get_advertisements = async () => {
  try {
    const response = await api.get(`/advertisements`);
    return response.data;
  } catch (error) {
    console.error("Error fetching advertisements:", error);
    return { success: false, error: error.response?.data?.message };
  }
};

export const get_random_menu_items = async () => {
  try {
    const response = await api.get("/menu-items/random-list");
    return response.data;
  } catch (error) {
    console.error("Error fetching random menu items:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

export const get_booking = async (page = 1, perPage = 10, status = null) => {
  try {
    // Build query string manually
    let queryString = `page=${page}&per_page=${perPage}`;
    
    // Add status filter if provided and not "all"
    if (status && status !== "all") {
      queryString += `&status=${status}`;
    }
    
    const response = await api.get(`/bookings?${queryString}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};