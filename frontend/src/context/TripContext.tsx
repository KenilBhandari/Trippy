import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { CurrentReport, DashboardData, Trip, User } from "../types";

type TripContextType = {
  
  activeTab: string
  setActiveTab: React.Dispatch<React.SetStateAction<string>>

  addingTrip: boolean;
  setAddingTrip: React.Dispatch<React.SetStateAction<boolean>>;
 
  
  activeTrip: Trip | null;
  setActiveTrip: React.Dispatch<React.SetStateAction<Trip | null>>;

  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>

  
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

  tripsLoading: boolean;
  setTripsLoading: React.Dispatch<React.SetStateAction<boolean>>;

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

  recentStartLocations: string[];
  setRecentStartLocations: React.Dispatch<React.SetStateAction<string[]>>;
  recentEndLocations: string[];
  setRecentEndLocations: React.Dispatch<React.SetStateAction<string[]>>;
  
  lastFare: number;
  setLastFare: React.Dispatch<React.SetStateAction<number>>
  lastNumberPlate: string;
  setLastNumberPlate: React.Dispatch<React.SetStateAction<string>>

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
  const [tripsLoading, setTripsLoading] = useState<boolean>(true);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [monthlyReport, setMonthlyReport] = useState<Trip[]>([]);

  const [quickDate, setQuickDate] = useState<string>("recent");
  const [search, setSearch] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");


  const [recentStartLocations, setRecentStartLocations] = useState<string[]>(
    () => {
      try {
        const stored = JSON.parse(
          localStorage.getItem("recent_start_loc") || "[]",
        );
        if (Array.isArray(stored) && stored.length > 0) {
          return stored;
        }
        return [];
      } catch {
        return [];
      }
    },
  );

  const [recentEndLocations, setRecentEndLocations] = useState<string[]>(
    () => {
      try {
        const stored = JSON.parse(
          localStorage.getItem("recent_end_loc") || "[]",
        );
        if (Array.isArray(stored) && stored.length > 0) {
          return stored;
        }
        return [];
      } catch {
        return [];
      }
    },
  );

  const [lastFare, setLastFare] = useState<number>(() => {
    try {
      const stored = localStorage.getItem("last_fare");
      const parsed = stored ? Number(JSON.parse(stored)) : 1400;
      return Number.isFinite(parsed) ? parsed : 1400;
    } catch {
      return 0;
    }
  });

  const [lastNumberPlate, setLastNumberPlate] = useState<string>(() => {
    try {
      const stored = localStorage.getItem("last_number_plate");
      return stored ? String(JSON.parse(stored)) : "9999";
    } catch {
      return "";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("last_fare", JSON.stringify(lastFare));
    } catch {
      // ignore write errors (private mode, quota, etc.)
    }
  }, [lastFare]);

  useEffect(() => {
    try {
      localStorage.setItem("last_number_plate", JSON.stringify(lastNumberPlate));
    } catch {
      // ignore write errors (private mode, quota, etc.)
    }
  }, [lastNumberPlate]);

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [dashboardNeedsRefresh, setDashboardNeedsRefresh] = useState(false);

  const [user, setUser] = useState<User | null>(null);

  const [currentMonthlyReport, setCurrentMonthlyReport] =
    useState<CurrentReport>();

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
        tripsLoading,
        setTripsLoading,
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
        recentStartLocations,
        setRecentStartLocations,
        recentEndLocations,
        setRecentEndLocations,
        dashboardData,
        setDashboardData,
        dashboardNeedsRefresh,
        setDashboardNeedsRefresh,
        currentMonthlyReport,
        setCurrentMonthlyReport,
        user,
        setUser,
        lastFare,
        setLastFare,
        lastNumberPlate,
        setLastNumberPlate
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
