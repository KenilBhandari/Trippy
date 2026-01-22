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


export interface DashboardData {
  monthStats: {
    totalRevenue: number;
    totalTrips: number;
    avgFare: number;
  };
  last7Days: {
    _id: string;
    totalRevenue: number;
    totalTrips: number;
  }[];
  monthlyTotals: {
    _id: number;
    totalRevenue: number;
  }[];
}

