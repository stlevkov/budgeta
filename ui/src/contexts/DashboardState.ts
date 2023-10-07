import RestClient from "../api/RestClient";
import Dashboard from "../data/classes/Dashboard";
import config from  '../resources/config';
import StateFactory from "./StateFactory";
import dayjs from 'dayjs';

export default class DashboardState {
  private state: Dashboard;
  private listeners: Function[] = [];
  private restClient: RestClient;
  private currentDate: dayjs.Dayjs;
  private month: string;
  private year: number;

  constructor(stateFactory: StateFactory) {
    this.restClient = new RestClient(config.api.dashboardEndpoint);
    this.currentDate = dayjs();
    this.month = this.currentDate.format('MMMM');
    this.year = Number(this.currentDate.format('YYYY'));
    this.handleStateChanged(this.month, this.year);
  }

  getCurrentDate(): { month: string; year: number } {
    return { month: this.month, year: this.year };
  }

  handleStateChanged(month: string, year: number): void {
    console.log("[DashboardState] Handle selected month changed: ", month + ' ' + year);
    console.log('[DashboardState] Fetching the dashboard item from DB...');
    this.restClient.genericFetch<Dashboard>([year, month]).then((data) => {
      console.log('[DashboardState] Data: ', data);
      this.setState(data);
    });
  }

  setState(newState: Dashboard): void {
    console.log("[DashboardState] Setting the state to new state...", newState);
    this.state = newState;
    this.listeners.forEach((listener) => listener(this.state));
  }

  getState(): Dashboard {
    return this.state;
  }

  addListener(listener: (data: Dashboard) => void): void {
    this.listeners.push(listener);
  }

  removeListener(listener: (data: Dashboard) => void): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }
}
