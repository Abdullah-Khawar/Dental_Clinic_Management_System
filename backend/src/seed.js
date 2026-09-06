import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db.js";
import { Doctor, Appointment } from "./models/index.js";
import ensureAdminExists from "./utils/ensureAdmin.js";
import sequelize from "./config/db.js";

const hoursFromNow = (hours) => new Date(Date.now() + hours * 60 * 60 * 1000);

const specializations = [
  "General Dentistry",
  "Orthodontics",
  "Pediatric Dentistry",
  "Oral Surgery",
  "Periodontics",
  "Endodontics",
  "Prosthodontics",
  "Cosmetic Dentistry",
];

const availabilities = [
  "Mon-Fri 9:00 AM - 5:00 PM",
  "Tue-Sat 10:00 AM - 6:00 PM",
  "Mon-Thu 8:00 AM - 2:00 PM",
  "Wed-Fri 11:00 AM - 7:00 PM",
  "Mon-Sat 9:00 AM - 1:00 PM",
];

const doctorNames = [
  "Dr. Ayesha Khan",
  "Dr. Bilal Ahmed",
  "Dr. Sara Malik",
  "Dr. Omar Raza",
  "Dr. Hina Qureshi",
  "Dr. Imran Siddiqui",
  "Dr. Mehwish Ali",
  "Dr. Farhan Zaidi",
  "Dr. Rabia Noor",
  "Dr. Kamran Iqbal",
  "Dr. Sana Javed",
  "Dr. Adnan Mir",
  "Dr. Zainab Fatima",
  "Dr. Haris Shah",
  "Dr. Nida Rehman",
  "Dr. Talha Anwar",
  "Dr. Amina Bashir",
  "Dr. Saad Hussain",
  "Dr. Maham Tariq",
  "Dr. Waleed Asif",
];

const patientNames = [
  "Ali Hassan",
  "Fatima Noor",
  "Hamza Iqbal",
  "Nadia Sheikh",
  "Usman Tariq",
  "Ayesha Rauf",
  "Zohaib Khan",
  "Maryam Saeed",
  "Danish Ali",
  "Sanaullah Mir",
  "Iqra Jamil",
  "Hassan Raza",
  "Laiba Ahmed",
  "Shahzaib Malik",
  "Hira Nadeem",
  "Arsalan Butt",
  "Mahnoor Gul",
  "Rehan Siddiqui",
  "Kinza Fatima",
  "Junaid Akram",
];

const reasons = [
  "Routine checkup",
  "Braces adjustment",
  "Tooth cleaning",
  "Tooth pain consultation",
  "Follow-up visit",
  "Root canal evaluation",
  "Filling replacement",
  "Wisdom tooth consult",
  "Whitening session",
  "Gum treatment",
];

const statuses = ["Pending", "Scheduled", "Completed", "Cancelled"];

const pad = (value, size = 7) => String(value).padStart(size, "0");

const seed = async () => {
  await connectDB();
  await ensureAdminExists();

  await Appointment.destroy({ where: {} });
  await Doctor.destroy({ where: {} });

  const doctors = await Doctor.bulkCreate(
    doctorNames.map((name, index) => ({
      name,
      specialization: specializations[index % specializations.length],
      phone: `+92-3${String(index).padStart(2, "0")}-${pad(1000000 + index)}`,
      email: `doctor${index + 1}@dental.local`,
      availability: availabilities[index % availabilities.length],
      isActive: index !== 3 && index !== 18,
    })),
  );

  const appointments = await Appointment.bulkCreate(
    patientNames.map((patientName, index) => ({
      patientName,
      patientContact: `+92-321-${pad(5550001 + index)}`,
      doctorId: doctors[index % doctors.length].id,
      dateTime: hoursFromNow(index * 3 - 12),
      reason: reasons[index % reasons.length],
      status: statuses[index % statuses.length],
    })), 
  );
  
  console.log("Seed completed successfully");
  console.log(`Doctors: ${doctors.length}`);
  console.log(`Appointments: ${appointments.length}`);
  console.log("Demo login: admin@dental.local / Admin123!");
 
  await sequelize.close();
  process.exit(0);
};

seed().catch(async (error) => {
  console.error("Seed failed:", error.message);
  await sequelize.close();
  process.exit(1);
});
