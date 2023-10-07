import Dashboard from "../classes/Dashboard";

export default interface DashboardListener {
    onDashboardStateChange(dashboard: Dashboard): void;
}
