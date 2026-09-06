import { baseApi } from "./baseApi";

const doctorTags = (result) =>
  result?.doctors
    ? [
        ...result.doctors.map((doctor) => ({
          type: "Doctors",
          id: doctor._id || doctor.id,
        })),
        { type: "Doctors", id: "LIST" },
      ]
    : [{ type: "Doctors", id: "LIST" }];

export const doctorsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDoctors: builder.query({
      query: (params = {}) => ({
        url: "/doctors",
        params,
      }),
      providesTags: doctorTags,
    }),
    getDoctor: builder.query({
      query: (id) => `/doctors/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Doctors", id }],
    }),
    createDoctor: builder.mutation({
      query: (body) => ({
        url: "/doctors",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Doctors", id: "LIST" }, "Dashboard"],
    }),
    updateDoctor: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/doctors/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Doctors", id },
        { type: "Doctors", id: "LIST" },
        "Dashboard",
      ],
    }),
    deleteDoctor: builder.mutation({
      query: (id) => ({
        url: `/doctors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Doctors", id: "LIST" },
        "Dashboard",
        "Appointments",
      ],
    }),
  }),
});

export const {
  useGetDoctorsQuery,
  useLazyGetDoctorsQuery,
  useGetDoctorQuery,
  useCreateDoctorMutation,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
} = doctorsApi;
