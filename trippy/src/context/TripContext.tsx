import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { CurrentReport, DashboardData, Trip } from "../types";

type TripContextType = {
  
  activeTab: string
  setActiveTab: React.Dispatch<React.SetStateAction<string>>

  addingTrip: boolean;
  setAddingTrip: React.Dispatch<React.SetStateAction<boolean>>;
 
  
  activeTrip: Trip | null;
  setActiveTrip: React.Dispatch<React.SetStateAction<Trip | null>>;
  
  deletingTrip: Trip | null;
  setDeletingTrip: React.Dispatch<React.SetStateAction<Trip | null>>;
  
  filterActive: boolean;
  setFilterActive: React.Dispatch<React.SetStateAction<boolean>>;

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

  dashboardData: DashboardData | null;
  setDashboardData: React.Dispatch<React.SetStateAction<DashboardData | null>>;

  dashboardNeedsRefresh: boolean;
  setDashboardNeedsRefresh: React.Dispatch<React.SetStateAction<boolean>>


  currentMonthlyReport: CurrentReport | undefined;
  setCurrentMonthlyReport: React.Dispatch<React.SetStateAction<CurrentReport | undefined>>;


};

const TripContext = createContext<TripContextType | undefined>(undefined);


export function TripProvider({ children }: { children: ReactNode }) {
  
    const [activeTab, setActiveTab] = useState<string>("new");
  const [addingTrip, setAddingTrip] = useState<boolean>(false);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [deletingTrip, setDeletingTrip] = useState<Trip | null>(null);
  const [filterActive, setFilterActive] = useState<boolean>(false);
  
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
  const [dashboardNeedsRefresh, setDashboardNeedsRefresh] = useState(false);


  const [currentMonthlyReport, setCurrentMonthlyReport] = useState <CurrentReport>()



  return (
    <TripContext.Provider
      value={{
        activeTab,
        setActiveTab,
        addingTrip,
        setAddingTrip,
        activeTrip,
        setActiveTrip,
        deletingTrip,
        setDeletingTrip,
        filterActive,
        setFilterActive,
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
        setDashboardData,
        dashboardNeedsRefresh,
        setDashboardNeedsRefresh,
        currentMonthlyReport,
        setCurrentMonthlyReport
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
