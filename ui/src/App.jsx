import "./App.css";
import Dashboard from "./layouts/Dashboard";
import SideNavBar from "./layouts/SideBar";
import withContexts from './utils/AppUtil';
import CreateDashboardDialog from "./components/dialogs/CreateDashboardDialog";

export default function App() {
  const DashboardWithContexts = withContexts(Dashboard);

  return (
    <div id="app" className="App" style={({ display: "flex" })} >
          <SideNavBar />
          <main style={{ width: '100%', marginTop: '6px', marginRight: '6px' }}>
            <DashboardWithContexts />
            <CreateDashboardDialog/>
          </main>
    </div>
  );
};