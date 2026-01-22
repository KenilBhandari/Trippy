import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { DashboardData, Trip } from "../types";

type TripContextType = {
  
  addingTrip: boolean;
  setAddingTrip: React.Dispatch<React.SetStateAction<boolean>>;

  activeTrip: Trip | null;
  setActiveTrip: React.Dispatch<React.SetStateAction<Trip | null>>;

  deletingTrip: Trip | null;
  setDeletingTrip: React.Dispatch<React.SetStateAction<Trip | null>>;

  allTrips: Trip[];
  setAllTrips: React.Dispatch<React.SetStateAction<Trip[]>>;

  last10Trips: Trip[];
  setLast10Trips: React.Dispatch<React.SetStateAction<Trip[]>>;

  recent25Trips: Trip[];
  setRecent25Trips: React.Dispatch<React.SetStateAction<Trip[]>>;

  filteredTrips: Trip[];
  setFilteredTrips: React.Dispatch<React.SetStateAction<Trip[]>>;

  monthlyReport: Trip[];
  setMonthlyReport: React.Dispatch<React.SetStateAction<Trip[]>>;

  quickDate: "recent" | "today" | "month" | string;
  setQuickDate: React.Dispatch<React.SetStateAction<string>>;

  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;

  fromDate: string;
  setFromDate: React.Dispatch<React.SetStateAction<string>>;

  toDate: string;
  setToDate: React.Dispatch<React.SetStateAction<string>>;

  startLocations: string[];
  endLocations: string[];

  dashboardData: DashboardData | null
  setDashboardData: React.Dispatch<React.SetStateAction<DashboardData | null>>


};

const TripContext = createContext<TripContextType | undefined>(undefined);


export function TripProvider({ children }: { children: ReactNode }) {
  
  const [addingTrip, setAddingTrip] = useState<boolean>(false);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [deletingTrip, setDeletingTrip] = useState<Trip | null>(null);

  const [allTrips, setAllTrips] = useState<Trip[]>([]);
  const [last10Trips, setLast10Trips] = useState<Trip[]>([]);
  const [recent25Trips, setRecent25Trips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [monthlyReport, setMonthlyReport] = useState<Trip[]>([]);

  const [quickDate, setQuickDate] = useState<string>("recent");
  const [search, setSearch] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const startLocations: string[] = ["Surat Transport", "Kamadgiri"];
  const endLocations: string[] = [
    "Vapi - Kamadgiri",
    "Vapi - Shree Transport",
    "Dadra",
  ];

    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);


  return (
    <TripContext.Provider
      value={{
        addingTrip,
        setAddingTrip,
        activeTrip,
        setActiveTrip,
        deletingTrip,
        setDeletingTrip,
        allTrips,
        setAllTrips,
        last10Trips,
        setLast10Trips,
        recent25Trips,
        setRecent25Trips,
        filteredTrips,
        setFilteredTrips,
        monthlyReport,
        setMonthlyReport,
        quickDate,
        setQuickDate,
        search,
        setSearch,
        fromDate,
        setFromDate,
        toDate,
        setToDate,
        startLocations,
        endLocations,
        dashboardData,
        setDashboardData
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useDataContext(): TripContextType {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useDataContext must be used within TripProvider");
  }
  return context;
}
