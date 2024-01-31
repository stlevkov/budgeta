import { Toast } from "material-react-toastify/dist/components";
import RestClient from "../api/RestClient";
import Dashboard from "../data/classes/Dashboard";
import Expense from "../data/classes/Expense";
import DashboardListener from "../data/interfaces/DashboardListener";
import config from '../resources/config';
import DashboardState from "./DashboardState";
import StateFactory from "./StateFactory";
import { toast } from "material-react-toastify";
import FactoryInitializable from "../data/interfaces/FactoryInitializable";
import dayjs from "dayjs";
import DocumentInfo from "../data/classes/DocumentInfo";
import loanSort from "../utils/Util"

export default class ExpensesState implements DashboardListener, FactoryInitializable<ExpensesState>{
  private expenseState: Expense[];
  private listeners: Array<(expenses: Expense[]) => void> = [];
  private saveListeners: Array<() => void> = [];
  private sumExpenses: number | undefined;
  private restClient: RestClient;
  private dashboardState: DashboardState | any;
  private selectedDashboard: Dashboard | undefined;

  constructor(stateFactory: StateFactory<ExpensesState>) { // Add the StateFactory parameter
    this.expenseState = [];
    this.listeners = [];
    this.saveListeners = [];
    this.sumExpenses = undefined;
    this.restClient = new RestClient(config.api.expensesEndpoint);
    this.selectedDashboard = undefined;
  }

  onFactoryReady(stateFactory: StateFactory<any>): void {
    this.dashboardState = stateFactory.getState(DashboardState);
    this.dashboardState.addListener(this.onDashboardStateChange.bind(this));
  }

  onDashboardStateChange(dashboard: Dashboard) {
    console.log('[ExpensesState] Dashboard has changed, fetching by dashboardId: ', dashboard.id);
    this.selectedDashboard = dashboard;
    this.restClient.genericFetch<Expense[]>([dashboard.id]).then((data) => {
        console.log('[ExpensesState] Data: ', data);
        this.setState(loanSort(data));
      }).catch((error) => {
        console.error('[ExpensesState] Error:', error);
        this.setState([]);
      });
  }

  setState(newState: Expense[]) {
    console.log("[ExpensesState] Setting the state to new state...", newState);
    if (newState.length > 0) {
      this.sumExpenses = newState
      .filter(expense => !(expense.scheduled && !expense.scheduledPeriod.includes(dayjs().month() + 1)))
      .map(expense => expense.value)
      .reduce((a, b) => a + b, 0);
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

  onChange(expense: Expense) {
    console.log('[ExpenseState] expense has changed: ', expense);
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
      this.setState(loanSort(this.expenseState));
      this.saveListeners.forEach((saveListener) => saveListener());
    });
  }

  addExpense(expenseCandidate: Expense) {
    if(this.selectedDashboard){
      expenseCandidate.dashboardId = this.selectedDashboard.id || '999999'; // TODO fix that
      this.restClient.genericCreate(expenseCandidate, (savedExpense: DocumentInfo) => {
        // Type assertion to Expense
        const expenseObject = savedExpense as Expense;
      
        this.setState(loanSort([...this.expenseState, expenseObject]));
        this.saveListeners.forEach((saveListener) => saveListener());
      });
      
    } else {
       toast.error("Unable to create new Expense. Please refresh the page and try again or contact admin.");
    }
  }

  removeExpense(expense: Expense) {
    this.restClient.genericDelete(expense, () => {
      const index = this.expenseState.indexOf(expense);
      if (index !== -1) {
        this.expenseState.splice(index, 1);
      }
      this.setState(loanSort(this.expenseState));
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
