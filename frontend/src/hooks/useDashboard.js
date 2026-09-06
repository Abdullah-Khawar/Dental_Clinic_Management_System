import { useGetDashboardQuery } from "../api/dashboardApi";

export function useDashboard() {
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetDashboardQuery();

  return {
    totalDoctors: data?.totalDoctors ?? 0,
    upcomingAppointments: data?.upcomingAppointments ?? 0,
    todaysAppointments: data?.todaysAppointments ?? 0,
    pendingAppointments: data?.pendingAppointments ?? 0,
    recentAppointments: data?.recentAppointments ?? [],
    isLoading: isLoading || isFetching,
    isError,
    error: error?.data?.message,
    refetch,
  };
}
