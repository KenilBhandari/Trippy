// Trip basic structure
export interface Trip {
  _id: string;
  tripDate: number;   
  startPoint: string;
  endPoint: string;
  returnTrip: boolean
  fare: number;
  recent?: string
  createdAt: number;
  updatedAt: number;
}

// When adding a new trip
export interface NewTripInput {
  tripDate: number;
  startPoint: string;
  endPoint: string;
  returnTrip: boolean
  fare: number;
}


export interface TripFilter {
  limit: number;
  sort: string;
  recent?: string;
  searchString?: string;
  dateFrom?: number;
  dateTo?: number;
}

// Dashboard component props
export interface DashboardProps {
  trips: Trip[];
  monthTrips: Trip[];
  monthTotal: number;
}

// API response types (recommended)
export interface ApiResponse<T> {
  status: "success" | "error";
  data: T;
  message?: string;
}
