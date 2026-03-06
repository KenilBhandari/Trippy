import { useEffect, useMemo, useState } from "react";
import type { NewTripInput, TripFilter, User } from "../types";
import { FileText, Home, Layers, Plus } from "lucide-react";
import NewTrip from "../components/New/New";
import Latest from "../components/Latest/Latest";
import TripManager from "../components/TripManager/TripManager";
import { fetchCustomTrips, sendTrip } from "../api/trips";
import { useDataContext } from "../context/TripContext";
import ReportsTab from "../components/Reports/Reports";
import Dashboard from "../components/Dashboard/Dashboard";

const Start = () => {
  const {
    activeTab,
    setActiveTab,
    setLast10Trips,
    setRecent25Trips,
    setDashboardNeedsRefresh,
    user,
    setUser,
    setTripsLoading
  } = useDataContext();

  const homeTabs = useMemo(
    () => [
      { id: "dashboard", label: "Dashboard", icon: Home },
      { id: "new", label: "New Trip", icon: Plus },
      { id: "list", label: "Trips", icon: Layers },
      { id: "reports", label: "Reports", icon: FileText },
    ],
    [],
  );

  const handleAddTrip = async (inputTrip: NewTripInput) => {
    try {
      const result = await sendTrip(inputTrip);
      if (result.status === "success") {
        const filter10: TripFilter = { limit: 10, sort: "created" };
        const filter25: TripFilter = { limit: 25, sort: "updated" };

        const [last10List, recent25List] = await Promise.all([
          fetchCustomTrips(filter10),
          fetchCustomTrips(filter25),
        ]);
        if (last10List.status === "success") setLast10Trips(last10List.data);
        if (recent25List.status === "success")
          setRecent25Trips(recent25List.data);
        setDashboardNeedsRefresh(true);
      }
    } catch (err) {
      console.error("Failed to send trip to server", err);
      throw err;
    }
  };

  const fetchFreshTrips = async () => {
    const filter10: TripFilter = { limit: 10, sort: "created" };
    const filter25: TripFilter = { limit: 25, sort: "updated" };

    const [last10List, recent25List] = await Promise.all([
      fetchCustomTrips(filter10),
      fetchCustomTrips(filter25),
    ]);

    if (last10List.status === "success") setLast10Trips(last10List.data);
    if (recent25List.status === "success") setRecent25Trips(recent25List.data);
  };

  // const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const init = async () => {
      setTripsLoading(true);
      try {
        await fetchFreshTrips();
      } catch (err) {
        console.error("Failed to fetch trips", err);
      } finally {
        setTripsLoading(false);
      }

      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        try {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (err) {
          console.error("Invalid user in localStorage");
          setUser(null);
        }
      }
    };

    init();
  }, []);

const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-gray-100 from-slate-50 via-blue-50 to-indigo-100">
        {/* --- THE RELIABLE ENTERPRISE HEADER --- */}
        <header className="w-full  bg-white border-b border-slate-200 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14 md:h-16 ">
              {/* Left: Brand and Integrated Navigation */}
              <div className="flex items-center gap-10">
                {/* Brand: Grounded and Professional */}
                <div className="flex items-center gap-2.5 shrink-0 group cursor-pointer">
                  <h1 className="text-xl md:text-2xl font-[1000] tracking-tighter text-gray-900 uppercase leading-none">
                    <span className="text-blue-600 ml-1 not-italic relative tracking-widest">
                      Trippy
                    </span>
                  </h1>
                </div>

                {/* Desktop Navigation: "The Workhorse" Style */}
                <nav className="hidden md:flex items-center h-16">
                  {homeTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                  h-full px-5 flex items-center gap-2.5 text-sm font-medium transition-all relative
                  ${
                    isActive
                      ? "text-blue-600 bg-blue-50/30"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }
                `}
                      >
                        <Icon size={18} strokeWidth={isActive ? 2.25 : 2} />
                        {tab.label}

                        {/* Fixed Underline Indicator - No Floating, Just Structure */}
                        {isActive && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Right: Functional Actions */}
              <div className="flex items-center gap-4">
                {/* User Account Section */}
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-3 pl-2.5 pr-1 py-1 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <div className="text-right ">
                      <p className="text-xs font-bold text-slate-900 leading-none max-w-[120px] truncate whitespace-nowrap">
                        Hi, {user?.name?.split(" ")[0] || "Guest"}!
                      </p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden ring-2 ring-white">
                      <img
                        src={user?.picture || "/Trippy_logo.png"}
                        alt="Profile"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/Trippy_logo.png";
                        }}
                      />
                    </div>
                  </button>

                  {/* Standard Dropdown: Clean and Precise */}
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg border border-slate-200 shadow-xl z-[100] py-1 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-4 py-3">
                        <p className="text-xs text-slate-500 font-medium">
                          Signed in as
                        </p>
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {user?.email || "user@example.com"}
                        </p>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            localStorage.clear();
                            window.location.reload();
                          }}
                          className="w-full text-left px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Dock */}
          <div className="md:hidden border-t border-slate-100 flex justify-around items-center h-14 bg-white px-2">
            {homeTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center w-full h-full gap-0.5 ${isActive ? "text-blue-600" : "text-slate-400"}`}
                >
                  <Icon size={20} />
                  <span className="text-[10px] font-bold tracking-tight">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-3 md:px-6 md:py-8">
          {activeTab === "dashboard" && <Dashboard />}

          {activeTab === "new" && (
            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="lg:w-1/2">
                <NewTrip onAddTrip={handleAddTrip} />
              </div>
              <div className="lg:w-1/2">
                <Latest />
              </div>
            </div>
          )}

          {activeTab === "list" && <TripManager />}

          {activeTab === "reports" && <ReportsTab />}
        </div>
      </div>
    </>
  );
};

export default Start;
