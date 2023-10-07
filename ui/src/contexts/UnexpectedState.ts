import RestClient from "../api/RestClient";
import config from '../resources/config';
import StateFactory from "./StateFactory";
import Dashboard from "../data/classes/Dashboard";
import Unexpected from "../data/classes/Unexpected";
import DashboardState from "./DashboardState";
import DashboardListener from "../data/interfaces/DashboardListener";

export default class UnexpectedState implements DashboardListener {
  private unexpectedState: Unexpected[]; // Change the type to Unexpected[]
  private listeners: Array<(unexpected: Unexpected[]) => void> = [];
  private saveListeners: Array<() => void> = [];
  private sumUnexpected: number | undefined;
  private restClient: RestClient;
  private dashboardState: DashboardState;

  constructor(stateFactory: StateFactory) { // Add the StateFactory parameter
    this.unexpectedState = [];
    this.listeners = [];
    this.saveListeners = [];
    this.sumUnexpected = undefined;
    this.restClient = new RestClient(config.api.unexpectedsEndpoint);
    this.dashboardState = stateFactory.getDashboardState();
    this.dashboardState.addListener(this.onDashboardStateChange.bind(this));
  }

  onDashboardStateChange(dashboard: Dashboard) {
    console.log('[UnexpectedState] Dashboard has changed, fetching by dashboardId: ', dashboard.id);
    this.restClient.genericFetch<Unexpected[]>([dashboard.id]).then((data) => {
        console.log('[UnexpectedState] Data: ', data);
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

  getSumUnexpected() {
    return this.sumUnexpected;
  }

  onChangeUnexpected(unexpected: Unexpected) {
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

  addUnexpected(unexpected: Unexpected) {
    this.restClient.genericCreate(unexpected, () => {
      this.setState([...this.unexpectedState, unexpected]);
      this.saveListeners.forEach((saveListener) => saveListener());
    });
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
