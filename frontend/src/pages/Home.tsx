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
    setUser
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
    fetchFreshTrips();

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
  }, []);

const [isMenuOpen, setIsMenuOpen] = useState(false);



  return (
    <>
      <div className="min-h-screen bg-gray-100 from-slate-50 via-blue-50 to-indigo-100">
        {/* Header */}
        <div className="relative z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between h-14 md:h-20">
              {/* Brand */}
              <div className="flex items-center gap-3">
                <div>
                  <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="flex flex-col">
                      <h1 className="text-xl md:text-2xl font-[1000] tracking-tighter text-gray-900 uppercase leading-none">
                        <span className="text-blue-600 ml-1 not-italic relative tracking-widest">
                          Trippy
                        </span>
                      </h1>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- Profile Picture Button Section --- */}
              <div className="relative flex items-center gap-3">
                {/* Welcome Text */}
                <div className="hidden sm:flex flex-col items-end leading-tight">
                  <span className="text-xs text-gray-400">Welcome back,</span>
                  <span className="text-sm font-medium text-gray-900">
                    {user?.name || "Guest"}
                  </span>
                </div>

                {/* Avatar */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="h-10 w-10 rounded-full overflow-hidden border border-gray-200 hover:border-gray-300 transition"
                >
                  <img
                    src={user?.picture || "/Trippy_logo.png"}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </button>

                {/* Dropdown */}
                {isMenuOpen && (
                  <div
                    className="
                    absolute right-0 top-12 w-60 md:w-72 
                    bg-white
                    rounded-2xl
                    border border-gray-100
                    shadow-[0_12px_40px_rgba(0,0,0,0.08)]
                    p-2
                    z-[1000]
                      "
                  >
                    {/* User Info Section */}
                    <div className="px-4 py-4">
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.name || "Guest"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {user?.email || "no-email@trippy.com"}
                      </p>
                    </div>

                    <div className="h-px bg-gray-100 my-1" />

                    {/* Actions */}
                    <div className="p-1">
                      <button
                        onClick={() => {
                          localStorage.removeItem("user");
                          localStorage.removeItem("token");
                          window.location.reload();
                        }}
                        className="
                          w-full text-left px-4 py-2.5
                          text-sm font-medium text-red-500
                          hover:bg-red-50
                          rounded-xl
                          transition
                        "
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

        {/* Nav Bar */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between">
              <div className="flex w-full justify-between md:justify-start md:gap-2">
                {homeTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-3 
                px-4 md:px-6 py-3 md:py-5 transition-all duration-500 relative shrink-0 group
                ${isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-600"}
              `}
                    >
                      {/* The "Smooth" Highlight Pill */}
                      <div
                        className={`
                absolute inset-y-2 inset-x-1 md:inset-y-3 md:inset-x-2 rounded-2xl transition-all duration-100
                ${isActive ? "bg-blue-50/60 opacity-100 scale-100" : "bg-transparent opacity-0 scale-95"}
              `}
                      />

                      {/* Icon - with a slight "jump" on active */}
                      <div
                        className={`
                relative z-10 transition-all duration-100
                ${isActive ? "-translate-y-0.5" : "group-hover:-translate-y-0.5"}
              `}
                      >
                        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                      </div>

                      {/* Label - Minimalist typography */}
                      <span
                        className={`
                relative z-10 text-[10px] md:text-sm font-semibold tracking-wide transition-all duration-100
                ${isActive ? "opacity-100" : "opacity-60"}
              `}
                      >
                        {tab.label}
                      </span>

                      {/* Extraordinary Detail: The "Floating Dot" */}
                      <div
                        className={`
                absolute bottom-1 md:bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-600 transition-all duration-100
                ${isActive ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-0 translate-y-2"}
              `}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

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
