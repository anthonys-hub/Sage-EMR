const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const pool = require("./db/db.js");
const auth = require("./routes/auth.js");
const users = require("./routes/users.js");
const patients = require("./routes/patients.js");
const appointments = require("./routes/appointments.js");
const doctors = require("./routes/doctors.js");
const cases = require("./routes/cases.js");
const insurances = require("./routes/insurances.js");
const visits = require("./routes/visits.js");
const waitlist = require("./routes/waitlist.js");
const reports = require("./routes/reports.js");
const profilePictureRoutes = require("./routes/profile-picture-routes.js");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/patients", patients);
app.use("/api/appointments", appointments);
app.use("/api/doctors", doctors);
app.use("/api/cases", cases);
app.use("/api/insurances", insurances);
app.use("/api/visits", visits);
app.use("/api/waitlist", waitlist);
app.use("/api/reports", reports);
app.use("/api/users", profilePictureRoutes);

app.get("/", (req, res) => {
  res.send("Server is on");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
