import axios from "axios";
import type { NewTripInput, Trip, TripFilter } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

export const sendTrip = async (trip: NewTripInput) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.post(
      `${API_URL}/trip/add`,
      { trip },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    // Standardize: return response.data
    return response.data;
  } catch (error: any) {
    console.error("Error sending trip:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchCustomTrips = async (filter: TripFilter) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.post(`${API_URL}/trip/fetchCustom`, filter, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // We expect { status: "success", data: [...] }
    if (response.data && response.data.status === "success") {
      return response.data;
    } else {
      throw new Error(response.data?.message || "Failed to fetch trip");
    }
  } catch (error: any) {
    console.error(
      "Error fetching trip:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const editTrip = async (trip: Trip) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.put(`${API_URL}/trip/edit/${trip._id}`, trip, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error updating trip:", error);
    throw error;
  }
};

export const deleteTripByID = async (tripId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.delete(`${API_URL}/trip/delete/${tripId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Error deleting trip:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const fetchDashboardStats = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/trip/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.status === "success") {
      return response.data;
    } else {
      throw new Error(response.data?.message || "Failed to fetch dashboard");
    }
  } catch (error) {
    console.error("Failed to fetch dashboard", error);
    throw error;
  }
};
