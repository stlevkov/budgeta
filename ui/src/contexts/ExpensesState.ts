import RestClient from "../api/RestClient";
import Dashboard from "../data/classes/Dashboard";
import Expense from "../data/classes/Expense";
import DashboardListener from "../data/interfaces/DashboardListener";
import config from '../resources/config';
import DashboardState from "./DashboardState";
import StateFactory from "./StateFactory";

export default class ExpensesState implements DashboardListener {
  private expenseState: Expense[];
  private listeners: Array<(expenses: Expense[]) => void> = [];
  private saveListeners: Array<() => void> = [];
  private sumExpenses: number | undefined;
  private restClient: RestClient;
  private dashboardState: DashboardState;

  constructor(stateFactory: StateFactory) { // Add the StateFactory parameter
    this.expenseState = [];
    this.listeners = [];
    this.saveListeners = [];
    this.sumExpenses = undefined;
    this.restClient = new RestClient(config.api.expensesEndpoint);
    this.dashboardState = stateFactory.getDashboardState();
    this.dashboardState.addListener(this.onDashboardStateChange.bind(this));
  }

  onDashboardStateChange(dashboard: Dashboard) {
    console.log('[ExpensesState] Dashboard has changed, fetching by dashboardId: ', dashboard.id);
    this.restClient.genericFetch<Expense[]>([dashboard.id]).then((data) => {
        console.log('[ExpensesState] Data: ', data);
        this.setState(data);
      }).catch((error) => {
        console.error('[ExpensesState] Error:', error);
        this.setState([]);
      });
  }

  setState(newState: Expense[]) {
    console.log("[ExpensesState] Setting the state to new state...", newState);
    if (newState.length > 0) {
      this.sumExpenses = newState.map((expense) => expense.value).reduce((a: number, b: number) => a + b);
    } else {
      this.sumExpenses = 0;
    }
    this.expenseState = [...newState];
    this.listeners.forEach((listener) => listener(this.expenseState));
  }

  getState() {
    return this.expenseState;
  }

  getSumExpenses() {
    return this.sumExpenses;
  }

  onChangeExpense(expense: Expense) {
    console.log('Expense candidate: ', expense);
    this.expenseState = this.expenseState.map((item) => {
      return item.id === expense.id ? expense : item;
    });
    this.setState(this.expenseState);
  }

  updateExpense(expense: Expense) {
    this.restClient.genericEdit(expense, () => {
      this.expenseState = this.expenseState.map((item) => {
        return item.id === expense.id ? expense : item;
      });
      this.setState(this.expenseState);
      this.saveListeners.forEach((saveListener) => saveListener());
    });
  }

  addExpense(expense: Expense) {
    this.restClient.genericCreate(expense, () => {
      this.setState([...this.expenseState, expense]);
      this.saveListeners.forEach((saveListener) => saveListener());
    });
  }

  removeExpense(expense: Expense) {
    this.restClient.genericDelete(expense, () => {
      const index = this.expenseState.indexOf(expense);
      if (index !== -1) {
        this.expenseState.splice(index, 1);
      }
      this.setState(this.expenseState);
      this.saveListeners.forEach((saveListener) => saveListener());
    });
  }

  addListener(listener: (expenses: Expense[]) => void) {
    this.listeners.push(listener);
  }

  removeListener(listener: (expenses: Expense[]) => void) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  addSaveListener(saveListener: () => void) {
    this.saveListeners.push(saveListener);
  }

  removeSaveListener(saveListener: () => void) {
    this.saveListeners = this.saveListeners.filter((l) => l !== saveListener);
  }
}
