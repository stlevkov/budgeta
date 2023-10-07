import RestClient from "../api/RestClient";
import config from '../resources/config';
import StateFactory from "./StateFactory";
import Dashboard from "../data/classes/Dashboard";
import DashboardListener from "../data/interfaces/DashboardListener";
import DashboardState from "./DashboardState";
import Income from "../data/classes/Income";

export default class IncomesState implements DashboardListener {
  private incomeState: Income[];
  private listeners: Array<(income: Income[]) => void> = [];
  private saveListeners: Array<() => void> = [];
  private sumIncomes: number | undefined;
  private restClient: RestClient;
  private dashboardState: DashboardState;

  constructor(stateFactory: StateFactory) {
    this.incomeState = [];
    this.listeners = [];
    this.saveListeners = [];
    this.sumIncomes = undefined;
    this.restClient = new RestClient(config.api.incomesEndpoint);
    this.dashboardState = stateFactory.getDashboardState();
    this.dashboardState.addListener(this.onDashboardStateChange.bind(this));
  }

  onDashboardStateChange(dashboard: Dashboard) {
    console.log('[IncomesState] Dashboard has changed, fetching by dashboardId: ', dashboard.id);
    this.restClient.genericFetch<Income[]>([dashboard.id]).then((data) => {
        console.log('[IncomesState] Data: ', data);
        this.setState(data);
      }).catch((error) => {
        console.error('[IncomesState] Error:', error);
        this.setState([]);
      });
  }

  setState(newState: Income[]) {
    console.log("[IncomesState] Setting the state to new state...", newState);
    if (newState.length > 0) {
      this.sumIncomes = newState.map((income) => income.value).reduce((a: number, b: number) => a + b);
    } else {
      this.sumIncomes = 0;
    }
    this.incomeState = [...newState];
    this.listeners.forEach((listener) => listener(this.incomeState)); // Notify all listeners that the state has changed
  }

  getState() {
    return this.incomeState;
  }

  getSumIncomes() {
    return this.sumIncomes;
  }

  onChangeIncome(income: Income) {
    console.log('Income candidate: ', income)
    this.incomeState.map((item) => {
      return item.id === income.id ? income : item;
    });
    this.setState(this.incomeState);
  }

  updateIncome(income: Income) {
    this.restClient.genericEdit(income, () => {
      this.incomeState.map((item) => {
        return item.id === income.id ? income : item;
      });
      this.setState(this.incomeState);
      this.saveListeners.forEach((saveListener) => saveListener());
    });
  }

  addIncome(income: Income) {
    this.restClient.genericCreate(income, () => {
      this.setState([...this.incomeState, income]);
      this.saveListeners.forEach((saveListener) => saveListener());
    })
  }

  removeIncome(income: Income) {
    this.restClient.genericDelete(income, () => {
      var index = this.incomeState.indexOf(income);
      if (index !== -1) {
        this.incomeState.splice(index, 1);
      }
      this.setState(this.incomeState);
      this.saveListeners.forEach((saveListener) => saveListener());
    });
  }

  addListener(listener: (income: Income[]) => void) {
    this.listeners.push(listener);
  }

  removeListener(listener: (income: Income[]) => void) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  addSaveListener(saveListener: () => void) {
    this.saveListeners.push(saveListener);
  }

  removeSaveListener(saveListener: () => void) {
    this.saveListeners = this.saveListeners.filter((l) => l !== saveListener);
  }
}
