import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  credentials: "include",
});

const baseQueryWithErrorHandling = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const message =
      result.error.data?.message ||
      result.error.error ||
      "Something went wrong";

    return {
      error: {
        status: result.error.status,
        data: { message },
      },
    };
  }

  return {
    data: result.data?.data ?? result.data,
  };
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Auth", "Doctors", "Appointments", "Dashboard"],
  endpoints: () => ({}),
});
