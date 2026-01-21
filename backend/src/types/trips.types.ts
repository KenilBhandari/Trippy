export interface Trip {
  startPoint: string;
  endPoint: string;
  fare: number;
  tripDate: Date;
  returnTrip?: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface TripInput {
  startPoint: string;
  endPoint: string;
  fare: number;
  tripDate: Date;
  returnTrip?: boolean;
}

export interface TripFilter {
  limit?: string | number;
  sort?: "updated" | "tripdate";
  dateFrom?: string | Date;
  dateTo?: string | Date;
  searchString?: string;
  recent?: "today" | "last_7_days" | "month" | "recent";
}