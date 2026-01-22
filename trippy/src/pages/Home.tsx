import { useEffect, useState } from "react";
import type { NewTripInput, TripFilter } from "../types";
import {
  BarChart3,
  Home,
  ClipboardCheck,
  Plus,
  Navigation,
  IndianRupee,
} from "lucide-react";
import NewTrip from "../components/New/New";
import Latest from "../components/Latest/Latest";
import TripManager from "../components/TripManager/TripManager";
import { fetchCustomTrips, sendTrip } from "../api/trips";
import { useDataContext } from "../context/TripContext";
import ReportsTab from "../components/Reports/Reports";
import Dashboard from "../components/Dashboard/Dashboard";
import { loadDashboard } from "../api/dashboard.service";

const Start = () => {
  const { last10Trips, setLast10Trips, setRecent25Trips, dashboardData, setDashboardData } = useDataContext();

  const [activeTab, setActiveTab] = useState("new");

  const homeTabs = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "new", label: "New Trip", icon: Plus },
    { id: "list", label: "Trips", icon: ClipboardCheck },
    { id: "reports", label: "Reports", icon: BarChart3 },
  ];

  const handleAddTrip = async (inputTrip: NewTripInput) => {
    try {
      const result = await sendTrip(inputTrip);
      if (result.status === "success") {
        const filter10: TripFilter = { limit: 10, sort: "created" };
        const filter25: TripFilter = { limit: 25, sort: "updated" };

        const [last10List, recent25List] = await Promise.all([
          fetchCustomTrips(filter10),
          fetchCustomTrips(filter25),
          loadDashboard(setDashboardData),
        ]);
        if (last10List.status === "success") setLast10Trips(last10List.data);
        if (recent25List.status === "success") setRecent25Trips(recent25List.data);
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

  useEffect(() => {
    fetchFreshTrips();
  }, []);

  const totalFare = last10Trips.reduce((sum, t) => sum + t.fare, 0);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-100  top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 md:px-8 md:py-5">
            <div className="flex items-center justify-between gap-4">
              {/* 1. Brand Section */}
              <div className="flex items-center gap-3">
                {/* Simple Brand Icon for Mobile */}
                <div className="bg-blue-600 p-2 rounded-xl md:hidden">
                  <Navigation size={18} className="text-white" />
                </div>
                <div>
                  <h1 className="text-lg md:text-2xl font-black tracking-tight text-gray-900">
                    Harsh <span className="text-blue-600">Tempo</span>
                  </h1>
                  <p className="hidden md:block text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                    Logistics Management
                  </p>
                </div>
              </div>

              {/* 2. Stats Badge (Revenue) */}
              <div className="relative group">
                {/* Decorative Glow */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>

                <div className="relative flex items-center gap-3 bg-white border border-gray-100 px-3 py-2 md:px-5 md:py-2.5 rounded-2xl shadow-sm">
                  <div className="bg-blue-50 p-2 rounded-lg hidden sm:block">
                    <IndianRupee size={16} className="text-blue-600" />
                  </div>

                  <div className="text-right sm:text-left leading-tight">
                    <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-tighter md:tracking-widest">
                      Total Revenue
                    </p>
                    <p className="text-base md:text-xl font-black text-gray-900">
                      ₹{totalFare.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nav Bar */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-2 md:px-4">
            <div className="flex items-center justify-between py-2 md:py-0">
              <div className="flex w-full justify-between md:justify-start md:gap-2">
                {/* Nav Item Component */}
                {homeTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 
                px-3 md:px-5 py-2 md:py-4 transition-all relative shrink-0
                ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-900"
                }
              `}
                    >
                      <div
                        className={`
                p-1.5 md:p-0 rounded-xl transition-colors
                ${isActive ? "bg-blue-50 md:bg-transparent" : "bg-transparent"}
              `}
                      >
                        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                      </div>

                      <span
                        className={`
                text-[10px] md:text-sm font-bold tracking-tight
                ${isActive ? "opacity-100" : "opacity-70"}
              `}
                      >
                        {tab.label}
                      </span>

                      {/* Modern Underline Indicator (Desktop only) */}
                      {isActive && (
                        <div className="hidden md:block absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-5 md:px-6 md:py-8">
          
          {activeTab === "dashboard" && (
            <Dashboard/>
          )}

          {activeTab === "new" && (
            <div className="flex flex-col gap-6 lg:flex-row">
              {/* Left: New Trip Form */}
              <div className="lg:w-1/2">
                <NewTrip onAddTrip={handleAddTrip} />
              </div>

              {/* Right: Latest Trips */}
              <div className="lg:w-1/2">
                <Latest />
              </div>
            </div>
          )}

          {activeTab === "list" && (
            <>
              <TripManager />
            </>
          )}

          {activeTab === "reports" && <ReportsTab />}
        </div>
      </div>
    </>
  );
};

// const Dashboard = ({ monthTrips, monthTotal }: DashboardProps) => {
//   const currentMonth = new Date().toLocaleDateString("en-IN", {
//     month: "long",
//     year: "numeric",
//   });
//   const avgFare =
//     monthTrips.length > 0 ? Math.round(monthTotal / monthTrips.length) : 0;

//   const getDailyData = () => {
//     const last7Days = [];
//     const today = new Date();

//     for (let i = 6; i >= 0; i--) {
//       const date = new Date(today);
//       date.setDate(date.getDate() - i);
//       const dateStr = date.toLocaleDateString("en-IN");

//       const dayTrips = monthTrips.filter((t) => {
//         const tripDateStr = new Date().toLocaleDateString("en-IN");
//         return tripDateStr === dateStr;
//       });
//       const dayTotal = dayTrips.reduce((sum, t) => sum + t.fare, 0);

//       last7Days.push({
//         date: date.toLocaleDateString("en-IN", {
//           weekday: "short",
//           day: "numeric",
//         }),
//         amount: dayTotal,
//         trips: dayTrips.length,
//       });
//     }

//     return last7Days;
//   };

//   const dailyData = getDailyData();
//   const maxAmount = Math.max(...dailyData.map((d) => d.amount), 1);

//   return (
//     <div className="space-y-6">
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600 mb-1">This Month Revenue</p>
//               <p className="text-3xl font-bold text-gray-900">
//                 ₹{monthTotal.toLocaleString()}
//               </p>
//               <p className="text-xs text-gray-500 mt-1">{currentMonth}</p>
//             </div>
//             <div className="bg-blue-100 p-3 rounded-full">
//               <TrendingUp className="text-blue-600" size={24} />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600 mb-1">Total Trips</p>
//               <p className="text-3xl font-bold text-gray-900">
//                 {monthTrips.length}
//               </p>
//               <p className="text-xs text-gray-500 mt-1">This month</p>
//             </div>
//             <div className="bg-green-100 p-3 rounded-full">
//               <Calendar className="text-green-600" size={24} />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600 mb-1">Average Fare</p>
//               <p className="text-3xl font-bold text-gray-900">₹{avgFare}</p>
//               <p className="text-xs text-gray-500 mt-1">Per trip</p>
//             </div>
//             <div className="bg-purple-100 p-3 rounded-full">
//               <BarChart3 className="text-purple-600" size={24} />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Chart */}
//       <div className="bg-white rounded-2xl shadow-lg p-6">
//         <h3 className="text-lg font-bold text-gray-800 mb-6">
//           Last 7 Days Performance
//         </h3>
//         <div className="space-y-4">
//           {dailyData.map((day, idx) => (
//             <div key={idx} className="flex items-center gap-4">
//               <div className="w-20 text-sm font-medium text-gray-700">
//                 {day.date}
//               </div>
//               <div className="flex-1">
//                 <div className="bg-gray-100 rounded-full h-10 relative overflow-hidden">
//                   <div
//                     className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-3"
//                     style={{ width: `${(day.amount / maxAmount) * 100}%` }}
//                   >
//                     {day.amount > 0 && (
//                       <span className="text-white font-semibold text-sm">
//                         ₹{day.amount}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//               <div className="w-20 text-sm text-gray-600 text-right">
//                 {day.trips} trips
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

export default Start;
