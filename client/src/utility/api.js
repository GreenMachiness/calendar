import { getToken } from "./utils";
//The base url of the API, can be changed in the .env.local file
const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:9000";

/**
 * Sends a login request to the api for a user with the provided email and password.
 *
 * @async
 * @function
 * @param {Object} data - An object containing the user's login credentials.
 * @param {string} data.email - The user's email.
 * @param {string} data.password - The user's password.
 * @returns {Promise<Object>} - A promise that resolves with the user's data.
 * @throws {Error} - Throws an error if there was an issue with the login request.
 */
export const login = async (data) => {
  const { email, password } = data;

  const response = await fetch(`${baseUrl}/users/login`, {
    method: "POST",
    headers: new Headers({
      Authorization: `Basic ${btoa(`${email}:${password}`)}`, //btoa is only deprecated in Node.js not in browser environments!
    }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      `Status Code: ${response?.status} - ${responseData?.message}`
    );
  }

  return responseData;
};

/**
 * Sends a registration request to the api for a user with the provided data.
 *
 * @async
 * @function
 * @param {Object} data - An object containing the user's data require to create an account.
 * @param {string} data.email - The user's email
 * @param {string} data.password - The user's password
 * @param {*} data.[...] - Any additional user data required for account creation
 * @returns {Promise<Object>} - A promise that resolves with the user's data.
 * @throws {Error} - Throws an error if there was an issue with the login request.
 */
export const register = async (data) => {
  const response = await fetch(`${baseUrl}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      `Status Code: ${response?.status} - ${responseData?.message}`
    );
  }

  return responseData;
};

export const getAllUsers = async ({ page, limit }) => {
  const token = getToken();
  if (!token) {
    throw new Error(`Missing User Token`);
  }

  // build the query string
  let query;

  if (page) {
    query = `page=${page}`;
  }

  if (limit) {
    query = `${query}&limit=${limit}`;
  }

  const response = await fetch(`${baseUrl}/users?${query}`, {
    method: "GET",
    headers: new Headers({
      Authorization: `Bearer ${token}`, //Token is required for protected Routes
    }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      `Status Code: ${response?.status} - ${responseData?.message}`
    );
  }

  return responseData;
};

export const fetchMe = async () => {
  const token = getToken();
  if (!token) {
    throw new Error(`Missing User Token`);
  }

  const response = await fetch(`${baseUrl}/users/me`, {
    method: "GET",
    headers: new Headers({
      Authorization: `Bearer ${token}`, // Token is required for protected Routes
    }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      `Status Code: ${response?.status} - ${responseData?.message}`
    );
  }

  return responseData;
};

export const createTask = async (newTask) => {
  const token = getToken();
  if (!token) {
    throw new Error(`Missing User Token`);
  }

  const response = await fetch(`${baseUrl}/tasks`, {
    method: "POST",
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(newTask),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      `Status Code: ${response?.status} - ${responseData?.message}`
    );
  }

  return responseData;
};

export const updateTask = async (taskId, updatedTaskData) => {
  const token = getToken();
  if (!token) {
    throw new Error(`Missing User Token`);
  }

  const response = await fetch(`${baseUrl}/tasks/${taskId}`, {
    method: "PUT",
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(updatedTaskData),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      `Status Code: ${response?.status} - ${responseData?.message}`
    );
  }

  return responseData;
};

export const deleteTask = async (taskId) => {
  const token = getToken();
  if (!token) {
    throw new Error(`Missing User Token`);
  }

  const response = await fetch(`${baseUrl}/tasks/${taskId}`, {
    method: "DELETE",
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      `Status Code: ${response?.status} - ${responseData?.message}`
    );
  }

  return responseData;
};

export const fetchTasks = async () => {
  const token = getToken();
  if (!token) {
    throw new Error(`Missing User Token`);
  }

  const response = await fetch(`${baseUrl}/tasks`, {
    method: "GET",
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      `Status Code: ${response?.status} - ${responseData?.message}`
    );
  }

  return responseData;
};

export const fetchNotifications = async () => {
  const token = getToken();
  if (!token) {
    throw new Error(`Missing User Token`);
  }

  const response = await fetch(`${baseUrl}/notifications`, {
    method: "GET",
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      `Status Code: ${response?.status} - ${responseData?.message}`
    );
  }

  return responseData;
};

export const createNotification = async (notificationData) => {
  const token = getToken();
  if (!token) {
    throw new Error(`Missing User Token`);
  }

  const response = await fetch(`${baseUrl}/notifications`, {
    method: "POST",
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(notificationData),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      `Status Code: ${response?.status} - ${responseData?.message}`
    );
  }

  return responseData;
};

export const updateNotification = async (
  notificationId,
  updatedNotificationData
) => {
  const token = getToken();
  if (!token) {
    throw new Error(`Missing User Token`);
  }

  const response = await fetch(`${baseUrl}/notifications/${notificationId}`, {
    method: "PUT",
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(updatedNotificationData),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      `Status Code: ${response?.status} - ${responseData?.message}`
    );
  }

  return responseData;
};

export const deleteNotification = async (notificationId) => {
  const token = getToken();
  if (!token) {
    throw new Error(`Missing User Token`);
  }

  const response = await fetch(`${baseUrl}/notifications/${notificationId}`, {
    method: "DELETE",
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      `Status Code: ${response?.status} - ${responseData?.message}`
    );
  }

  return responseData;
};
