import axios from "axios";
import type { NewTripInput, Trip, TripFilter } from "../types";



const API_URL = "http://localhost:5000";


export const sendTrip = async (trip: NewTripInput) => {
  try {
    const response = await axios.post(`${API_URL}/trip/add`, trip);
    // Standardize: return response.data
    return response.data; 
  } catch (error: any) {
    console.error("Error sending trip:", error.response?.data || error.message);
    throw error;
  }
};


export const fetchCustomTrips = async (filter: TripFilter) => {
  try {
    const response = await axios.post(`${API_URL}/trip/fetchCustom`, filter);
    // We expect { status: "success", data: [...] }
    if (response.data && response.data.status === "success") {
      return response.data; 
    } else {
      throw new Error(response.data?.message || "Failed to fetch trip");
    }
  } catch (error: any) {
    console.error("Error fetching trip:", error.response?.data || error.message);
    throw error;
  }
};


export const editTrip = async (trip: Trip) => {
  try {
    const response = await axios.put(`${API_URL}/trip/edit/${trip._id}`, trip);
    return response.data; 
  } catch (error: any) {
    console.error("Error updating trip:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteTripByID = async (tripId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/trip/delete/${tripId}`);    
    return response.data; 
  } catch (error: any) {
    console.error("Error deleting trip:", error.response?.data || error.message);
    throw error;
  }
};


export const dashboardSummary = async () => {
  try {
    const response = await axios.get(`${API_URL}/trip/dashboard`);
    if (response.data && response.data.status === "success") {
      return response.data;
    } else {
      throw new Error(response.data?.message || "Failed to fetch trip");
    }
  } catch (error) {
    console.error("Failed to fetch dashboard summary", error);
    throw error;
  }
};




