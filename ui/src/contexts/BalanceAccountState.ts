import { toast } from "material-react-toastify";
import RestClient from "../api/RestClient";
import BalanceTransaction from "../data/classes/BalanceTransaction";
import Dashboard from "../data/classes/Dashboard";
import config from  '../resources/config';
import DashboardState from "./DashboardState";
import StateFactory from "./StateFactory";
import FactoryInitializable from "../data/interfaces/FactoryInitializable";

export default class BalanceAccountState implements FactoryInitializable<BalanceAccountState> {
   private state: BalanceTransaction[];
   private listeners: Array<(balanceTransactions: BalanceTransaction[]) => void> = [];
   private transactionListeners: Array<(balanceTransaction: BalanceTransaction) => void> = [];
   private restClient: RestClient;
   private dashboardState: DashboardState | any;
   private selectedDashboard: Dashboard | any;

  constructor(stateFactory: StateFactory<BalanceAccountState>) {
    this.state = [];
    this.listeners = [];
    this.transactionListeners = [];
    this.restClient = new RestClient(config.api.balanceAccountEndpoint);
    this.selectedDashboard = {};
  }

  onFactoryReady(stateFactory: StateFactory<any>): void {
    this.dashboardState = stateFactory.getState(DashboardState);
    this.dashboardState.addListener(this.onDashboardStateChange.bind(this));
  }

  onDashboardStateChange(dashboard: Dashboard) {
    console.log('[BalanceAccountState] Dashboard has changed, fetching by dashboardId: ', dashboard.id);
    this.selectedDashboard = dashboard;
    this.restClient.genericFetch<BalanceTransaction[]>([dashboard.id]).then((data) => {
        console.log('[BalanceAccountState] Data: ', data);
        this.setState(data);
      }).catch((error) => {
        console.error('[BalanceAccountState] Error:', error);
        this.setState([]);
      });
  }
  
  // TODO Update the state once the UI Component for the Account History is ready
  newTransaction(balanceTransaction: BalanceTransaction) {
    if(this.selectedDashboard){
      balanceTransaction.dashboardId = this.selectedDashboard.id;
      console.log('[BalanceAccountState] Creating new transaction: ', balanceTransaction);
      this.restClient.genericCreate(balanceTransaction, () => {
        this.transactionListeners.forEach((listener) => listener(balanceTransaction));
      });
    } else {
      toast.error('Unable to create new transaction to balance account. Please try again.');
    }
  }

  getState() {
    return this.state;
  }

  setState(newState: BalanceTransaction[]) {
    console.log("[BalanceAccountState] Setting the state to new state...", newState);
    this.state = [...newState];
    this.listeners.forEach((listener) => listener(this.state));
  }

  addListener(listener: (balanceTransactions: BalanceTransaction[]) => void) {
    this.listeners.push(listener);
  }

  removeListener(listener: (balanceTransactions: BalanceTransaction[]) => void) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  addTransactionListener(listener: (balanceTransaction: BalanceTransaction) => void) {
    this.transactionListeners.push(listener);
  }

  removeTransactionListener(listener: (balanceTransaction: BalanceTransaction) => void) {
    this.transactionListeners = this.transactionListeners.filter((l) => l !== listener);
  }
}