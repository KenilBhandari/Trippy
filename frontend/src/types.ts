export interface User {
  email: string;
  id: string;
  name: string;
  picture: string
}


// Trip basic structure
export interface Trip {
  _id: string;
  tripDate: number;   
  startPoint: string;
  endPoint: string;
  returnTrip: boolean
  fare: number;
  numberPlate: string | null;
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
  numberPlate: string | null;
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

export interface CurrentReport {
  month: number;
  year: number;
}


//DASHBOARD

export type DashboardSummary = {
  trips: number;
  avgFare: number;
  monthRevenue: number;
  weekRevenue: number;
};

type Last7DaysPoint = {
  _id: string;
  dailyRevenue: number;
  totalTrips: number;
};

type MonthlyPoint = {
  _id: string;
  monthlyRevenue: number;
  totalTrips: number;
};

export type DashboardData = {
  summary: DashboardSummary;
  series: {
    last7DaysSeries: Last7DaysPoint[];
    monthlySeries: MonthlyPoint[];
  };
};

