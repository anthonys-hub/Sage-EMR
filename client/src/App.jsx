import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./Pages/Login";
import Schedule from "./Pages/Schedule";
import Sidebar from "./Components/Sidebar";
import Charts from "./Pages/Charts";
import Patients from "./Pages/Patients";
import Reports from "./Pages/Reports";
import Settings from "./Pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />


        <Route element={<Sidebar />}>
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/charts" element={<Charts />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

      </Routes>
    </BrowserRouter >
  )
}

export default App