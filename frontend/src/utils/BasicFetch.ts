import { fetchCustomTrips } from "../api/trips";
import type { TripFilter } from "../types";

type FetchTripsArgs = {
  setLast10Trips: (data: any[]) => void;
  setRecent25Trips: (data: any[]) => void;
};

type FetchCustProps = {
  setFilteredTrips: (data: any[]) => void;
}

type FetchReportProps = {
  setMonthlyReport: (data: any[]) => void;
}

export const fetchAndSetTrips = async ({ setLast10Trips, setRecent25Trips }: FetchTripsArgs) => {
  try {
    const filter10: TripFilter = { limit: 10, sort: "created" };
    const filter25: TripFilter = { limit: 25, sort: "updated" };

    const [last10List, recent25List] = await Promise.all([
      fetchCustomTrips(filter10),
      fetchCustomTrips(filter25),
    ]);
    
    if (last10List?.status === "success") {
      setLast10Trips(last10List.data);
    }

    if (recent25List?.status === "success") {
      setRecent25Trips(recent25List.data);
    }
  } catch (err) {
    console.error("Failed to fetch initial trips", err);
    throw err;
  }
};

export const custFetch = async (filters: TripFilter, { setFilteredTrips }: FetchCustProps) => {
  try {
    const result = await fetchCustomTrips(filters);

    // Guard against empty results
    if (result && result.status === "success") {
      setFilteredTrips(result.data);
      return result.data;
    }
  } catch (error) {
    console.error("Failed to fetch filtered trips", error);
    throw error;
  }
};


export const fetchReports = async (filters: TripFilter, { setMonthlyReport }: FetchReportProps) => {
  try {
    const result = await fetchCustomTrips(filters);
    if (result && result.status === "success") {
      const reportData = Array.isArray(result.data) ? result.data : [];
      if (reportData.length > 0) {
        setMonthlyReport(reportData);
      } else {
        console.log("Empty data received, skipping state update.");
      }
      return reportData;
    } else {
      throw new Error("API returned success: false or invalid data");
    }
  } catch (error) {
    console.error("Failed to fetch filtered trips", error);
    throw error;
  }
}