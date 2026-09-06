import { baseApi } from "./baseApi";

const appointmentTags = (result) =>
  result?.appointments
    ? [
        ...result.appointments.map((appointment) => ({
          type: "Appointments",
          id: appointment._id || appointment.id,
        })),
        { type: "Appointments", id: "LIST" },
      ]
    : [{ type: "Appointments", id: "LIST" }];

export const appointmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAppointments: builder.query({
      query: (params = {}) => ({
        url: "/appointments",
        params,
      }),
      providesTags: appointmentTags,
    }),
    getAppointment: builder.query({
      query: (id) => `/appointments/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Appointments", id }],
    }),
    createAppointment: builder.mutation({
      query: (body) => ({
        url: "/appointments",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Appointments", id: "LIST" }, "Dashboard"],
    }),
    updateAppointment: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/appointments/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Appointments", id },
        { type: "Appointments", id: "LIST" },
        "Dashboard",
      ],
    }),
    deleteAppointment: builder.mutation({
      query: (id) => ({
        url: `/appointments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Appointments", id: "LIST" }, "Dashboard"],
    }),
  }),
});

export const {
  useGetAppointmentsQuery,
  useLazyGetAppointmentsQuery,
  useGetAppointmentQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
} = appointmentsApi;
