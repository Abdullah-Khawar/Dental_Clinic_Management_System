import {
  useGetProfileQuery,
  useLoginMutation,
  useLogoutMutation,
} from "../api/authApi";

export function useAuth() {
  const {
    data: user,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [login, loginState] = useLoginMutation();
  const [logout, logoutState] = useLogoutMutation();

  const unauthorized = error?.status === 401;

  return {
    user: user || null,
    isAuthenticated: Boolean(user) && !unauthorized,
    isLoading: (isLoading || isFetching) && !unauthorized && !user,
    isError: isError && !unauthorized,
    error: error?.data?.message,
    refetch,
    login,
    logout,
    loginState,
    logoutState,
  };
}
