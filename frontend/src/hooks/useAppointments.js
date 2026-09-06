import { useEffect, useMemo, useState } from "react";
import {
  useGetAppointmentsQuery,
  useLazyGetAppointmentsQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
} from "../api/appointmentsApi";

const itemId = (item) => item?._id || item?.id;

export function useAppointments(params = {}) {
  const { cursor: _ignoredCursor, ...baseParams } = params;
  const [extraAppointments, setExtraAppointments] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  const filterKey = useMemo(() => JSON.stringify(baseParams), [baseParams]);

  const { data, isLoading, isFetching, isError, error, refetch, fulfilledTimeStamp } =
    useGetAppointmentsQuery(baseParams);

  const [fetchMore, moreState] = useLazyGetAppointmentsQuery();

  useEffect(() => {
    setExtraAppointments([]);
    setNextCursor(data?.pagination?.nextCursor ?? null);
    setHasNextPage(Boolean(data?.pagination?.hasNextPage));
  }, [filterKey, fulfilledTimeStamp, data?.pagination?.nextCursor, data?.pagination?.hasNextPage]);

  const appointments = useMemo(() => {
    const firstPage = data?.appointments ?? [];
    if (!extraAppointments.length) return firstPage;

    const seen = new Set(firstPage.map(itemId));
    const appended = extraAppointments.filter((appointment) => {
      const id = itemId(appointment);
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });

    return [...firstPage, ...appended];
  }, [data?.appointments, extraAppointments]);

  const loadMore = async () => {
    if (!hasNextPage || !nextCursor || moreState.isFetching) return;

    const result = await fetchMore({
      ...baseParams,
      cursor: nextCursor,
    }).unwrap();

    setExtraAppointments((prev) => [...prev, ...(result.appointments || [])]);
    setNextCursor(result.pagination?.nextCursor ?? null);
    setHasNextPage(Boolean(result.pagination?.hasNextPage));
  };

  return {
    appointments,
    pagination: {
      limit: data?.pagination?.limit,
      nextCursor,
      hasNextPage,
    },
    isLoading: isLoading || (isFetching && !extraAppointments.length),
    isFetching: isFetching || moreState.isFetching,
    isError,
    error: error?.data?.message || moreState.error?.data?.message,
    refetch,
    loadMore,
  };
}

export function useAppointmentMutations() {
  const [createAppointment, createState] = useCreateAppointmentMutation();
  const [updateAppointment, updateState] = useUpdateAppointmentMutation();
  const [deleteAppointment, deleteState] = useDeleteAppointmentMutation();

  return {
    createAppointment,
    updateAppointment,
    deleteAppointment,
    createState,
    updateState,
    deleteState,
  };
}
