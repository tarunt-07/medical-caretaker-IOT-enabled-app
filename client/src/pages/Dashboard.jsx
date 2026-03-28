import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import MedicineCard from "../components/cards/MedicineCard";
import AlertCard from "../components/cards/AlertCard";
import RecoveryBarChart from "../components/charts/RecoveryBarChart";
import MedicinePieChart from "../components/charts/MedicinePieChart";


function Dashboard() {
  return (
    <div className="dashboard-layout medical-bg">
      <Sidebar />

      <main className="main-panel">
        <Topbar />

        <div className="dashboard-grid">
          <div className="glass-card section-card">
            <h3>Medicine Schedule</h3>
            <div className="medicine-list">
              <MedicineCard
                name="Paracetamol"
                dosage="500 mg"
                time="8:00 AM"
                status="Pending"
              />
              <MedicineCard
                name="Vitamin D"
                dosage="1 Tablet"
                time="1:00 PM"
                status="Taken"
              />
              <MedicineCard
                name="BP Tablet"
                dosage="250 mg"
                time="9:00 PM"
                status="Pending"
              />
            </div>
          </div>

          <div className="glass-card section-card">
            <h3>Latest Alerts</h3>
            <div className="alert-list">
              <AlertCard
                title="Missed Pill Alert"
                text="Morning medicine was not marked as taken."
              />
              <AlertCard
                title="Doctor Review Pending"
                text="Doctor approval required for medicine alteration."
              />
              <AlertCard
                title="Health Observation"
                text="Mild fever recorded in day-to-day caretaker log."
              />
            </div>
          </div>

          <div className="glass-card section-card">
            <h3>Recovery Progress</h3>
            <RecoveryBarChart />
          </div>

          <div className="glass-card section-card">
            <h3>Medicine Record</h3>
            <MedicinePieChart />
          </div>

          <div className="glass-card section-card">
            <h3>Patient Condition</h3>
            <p><strong>Illness:</strong> Post-surgery recovery</p>
            <p><strong>Condition:</strong> Stable, under observation</p>
            <p><strong>Doctor Note:</strong> Continue scheduled medicine and hydration</p>
            <p><strong>Reports:</strong> Blood test and ECG pending review</p>
          </div>

          <div className="glass-card section-card">
            <h3>Smart Device Status</h3>
            <p><strong>Device:</strong> Smart Medicine Dispenser</p>
            <p><strong>Connection:</strong> Online</p>
            <p><strong>Last Sync:</strong> 10 mins ago</p>
            <p><strong>IoT Alert:</strong> No critical issue</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;