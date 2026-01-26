import { fetchDashboardStats } from "./trips";

  export const loadDashboard = async (setDashboardData: (data: any) => void) => {
    try {
      const result = await fetchDashboardStats();
      if (result.status === "success") {
        setDashboardData(result.data);
        return result;
      } else {
        throw new Error("Api refused Dashboard Data");
      }
    } catch (err) {
      console.error("Failed to fetch Dashboard Data", err);
      throw err;
    }
  };