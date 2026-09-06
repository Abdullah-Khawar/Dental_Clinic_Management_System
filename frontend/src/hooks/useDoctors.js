import { useEffect, useMemo, useState } from "react";
import {
  useGetDoctorsQuery,
  useLazyGetDoctorsQuery,
  useGetDoctorQuery,
  useCreateDoctorMutation,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
} from "../api/doctorsApi";

const itemId = (item) => item?._id || item?.id;

export function useDoctors(params = {}) {
  const { cursor: _ignoredCursor, ...baseParams } = params;
  const [extraDoctors, setExtraDoctors] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  const filterKey = useMemo(() => JSON.stringify(baseParams), [baseParams]);

  const { data, isLoading, isFetching, isError, error, refetch, fulfilledTimeStamp } =
    useGetDoctorsQuery(baseParams);

  const [fetchMore, moreState] = useLazyGetDoctorsQuery();

  useEffect(() => {
    setExtraDoctors([]);
    setNextCursor(data?.pagination?.nextCursor ?? null);
    setHasNextPage(Boolean(data?.pagination?.hasNextPage));
  }, [filterKey, fulfilledTimeStamp, data?.pagination?.nextCursor, data?.pagination?.hasNextPage]);

  const doctors = useMemo(() => {
    const firstPage = data?.doctors ?? [];
    if (!extraDoctors.length) return firstPage;

    const seen = new Set(firstPage.map(itemId));
    const appended = extraDoctors.filter((doctor) => {
      const id = itemId(doctor);
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });

    return [...firstPage, ...appended];
  }, [data?.doctors, extraDoctors]);

  const loadMore = async () => {
    if (!hasNextPage || !nextCursor || moreState.isFetching) return;

    const result = await fetchMore({
      ...baseParams,
      cursor: nextCursor,
    }).unwrap();

    setExtraDoctors((prev) => [...prev, ...(result.doctors || [])]);
    setNextCursor(result.pagination?.nextCursor ?? null);
    setHasNextPage(Boolean(result.pagination?.hasNextPage));
  };

  return {
    doctors,
    pagination: {
      limit: data?.pagination?.limit,
      nextCursor,
      hasNextPage,
    },
    isLoading: isLoading || (isFetching && !extraDoctors.length),
    isFetching: isFetching || moreState.isFetching,
    isError,
    error: error?.data?.message || moreState.error?.data?.message,
    refetch,
    loadMore,
  };
}

export function useDoctor(id) {
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetDoctorQuery(id, { skip: !id });

  return {
    doctor: data || null,
    isLoading: isLoading || isFetching,
    isError,
    error: error?.data?.message,
    refetch,
  };
}

export function useDoctorMutations() {
  const [createDoctor, createState] = useCreateDoctorMutation();
  const [updateDoctor, updateState] = useUpdateDoctorMutation();
  const [deleteDoctor, deleteState] = useDeleteDoctorMutation();

  return {
    createDoctor,
    updateDoctor,
    deleteDoctor,
    createState,
    updateState,
    deleteState,
  };
}
