import RestClient from "../api/RestClient";
import config from '../resources/config';
import StateFactory from "./StateFactory";
import Dashboard from "../data/classes/Dashboard";
import Unexpected from "../data/classes/Unexpected";
import DashboardState from "./DashboardState";
import DashboardListener from "../data/interfaces/DashboardListener";
import { toast } from "material-react-toastify";
import FactoryInitializable from "../data/interfaces/FactoryInitializable";

export default class UnexpectedState implements DashboardListener, FactoryInitializable<UnexpectedState>{
  private unexpectedState: Unexpected[];
  private listeners: Array<(unexpected: Unexpected[]) => void> = [];
  private saveListeners: Array<() => void> = [];
  private sumUnexpected: number;
  private restClient: RestClient;
  private dashboardState: DashboardState | any;
  private selectedDashboard: Dashboard | any;

  constructor(stateFactory: StateFactory<UnexpectedState>) {
    this.unexpectedState = [];
    this.listeners = [];
    this.saveListeners = [];
    this.sumUnexpected = 0;
    this.restClient = new RestClient(config.api.unexpectedsEndpoint);
    this.selectedDashboard = {};
  }

  onFactoryReady(factory: StateFactory<any>): void {
    this.dashboardState = factory.getState(DashboardState);
    this.dashboardState.addListener(this.onDashboardStateChange.bind(this));
  }

  onDashboardStateChange(dashboard: Dashboard) {
    console.log('[UnexpectedState] Dashboard has changed, fetching by dashboardId: ', dashboard.id);
    this.selectedDashboard = dashboard;
    this.restClient.genericFetch<Unexpected[]>([dashboard.id]).then((data) => {
      this.setState(data);
    }).catch((error) => {
      console.error('[UnexpectedState] Error:', error);
      this.setState([]);
    });
  }

  setState(newState: Unexpected[]) {
    console.log("[UnexpectedState] Setting the state to new state...", newState);
    if (newState.length > 0) {
      this.sumUnexpected = newState.map((unexpected) => unexpected.value).reduce((a: number, b: number) => a + b);
    } else {
      this.sumUnexpected = 0;
    }
    this.unexpectedState = [...newState];
    this.listeners.forEach((listener) => listener(this.unexpectedState));
  }

  getState() {
    return this.unexpectedState;
  }

  getSumUnexpecteds() {
    return this.sumUnexpected;
  }

  onChange(unexpected: Unexpected) {
    console.log('Unexpected candidate: ', unexpected);
    this.unexpectedState = this.unexpectedState.map((item) => {
      return item.id === unexpected.id ? unexpected : item;
    });
    this.setState(this.unexpectedState);
  }

  updateUnexpected(unexpected: Unexpected) {
    this.restClient.genericEdit(unexpected, () => {
      this.unexpectedState = this.unexpectedState.map((item) => {
        return item.id === unexpected.id ? unexpected : item;
      });
      this.setState(this.unexpectedState);
      this.saveListeners.forEach((saveListener) => saveListener());
    });
  }

  addUnexpected(unexpectedCandidate: Unexpected) {
    if (this.selectedDashboard) {
      unexpectedCandidate.dashboardId = this.selectedDashboard.id;
      this.restClient.genericCreate(unexpectedCandidate, (savedUnexpected) => {
        this.setState([...this.unexpectedState, savedUnexpected]);
        this.saveListeners.forEach((saveListener) => saveListener());
      });
    } else {
      toast.error("Unable to create new Unexpected. Please refresh the page and try again or contact admin.");
    }
  }

  removeUnexpected(unexpected: Unexpected) {
    this.restClient.genericDelete(unexpected, () => {
      const index = this.unexpectedState.indexOf(unexpected);
      if (index !== -1) {
        this.unexpectedState.splice(index, 1);
      }
      this.setState(this.unexpectedState);
      this.saveListeners.forEach((saveListener) => saveListener());
    });
  }

  addListener(listener: (unexpected: Unexpected[]) => void) {
    this.listeners.push(listener);
  }

  removeListener(listener: (unexpected: Unexpected[]) => void) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  addSaveListener(saveListener: () => void) {
    this.saveListeners.push(saveListener);
  }

  removeSaveListener(saveListener: () => void) {
    this.saveListeners = this.saveListeners.filter((l) => l !== saveListener);
  }
}
