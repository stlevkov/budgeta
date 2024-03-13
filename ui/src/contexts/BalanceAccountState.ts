import RestClient from "../api/RestClient";
import BalanceAccountTransaction from "../data/classes/BalanceAccountTransaction";
import Dashboard from "../data/classes/Dashboard";
import config from '../resources/config';
import DashboardState from "./DashboardState";
import StateFactory from "./StateFactory";
import FactoryInitializable from "../data/interfaces/FactoryInitializable";
import { BalanceAccount } from "../data/classes/BalanceAccount";

export default class BalanceAccountState implements FactoryInitializable<BalanceAccountState> {
  private transactionState: BalanceAccountTransaction[];
  private state: BalanceAccount[];
  private listeners: Array<(balanceAccount: BalanceAccount[]) => void> = [];

  /**
   * TODO Introduce paging, as this will transfer huge lists and increase memory consumption
   */
  private transactionListeners: Array<(balanceAccountTransaction: BalanceAccountTransaction[]) => void> = [];
  private restClient: RestClient;
  private restClientTransactions: RestClient;
  private dashboardState: DashboardState | any;

  constructor(stateFactory: StateFactory<BalanceAccountState>) {
    this.transactionState = []; // TODO not need to track here because they will grow and needs lazy approach
    this.state = [];
    this.listeners = [];
    this.transactionListeners = [];
    this.restClient = new RestClient(config.api.balanceAccountEndpoint);
    this.restClientTransactions = new RestClient(config.api.balanceAccountTransactionEndpoint);
  }

  onFactoryReady(stateFactory: StateFactory<any>): void {
    this.dashboardState = stateFactory.getState(DashboardState);
    this.dashboardState.addListener(this.onDashboardStateChange.bind(this));
  }

  onDashboardStateChange(dashboard: Dashboard) {
    console.log('[BalanceAccountState] Dashboard has changed, fetching by dashboardId: ', dashboard.id);
    this.fetchBalanceAccounts();
  }

  getSumAccounts() {
    return this.state
        .filter(account => account.active) // Only consider active accounts
        .reduce((acc, account) => acc + Number(account.value), 0);
}

  addBalanceAccount(balanceAccount: BalanceAccount) {
    console.log('[BalanceAccountState] Adding balance account: ', balanceAccount);
    this.restClient.genericCreate(balanceAccount, () => {
      this.setState([...this.state, balanceAccount]);
    });
  }

  // TODO Update the state once the UI Component for the Account History is ready
  newTransaction(balanceTransaction: BalanceAccountTransaction[], balanceAccount: BalanceAccount) {
    console.log('[BalanceAccountState] Creating new transaction: ', balanceTransaction);
    console.log('[BalanceAccountState] Updating the balance account: ', balanceAccount);
    this.restClientTransactions.genericCreate(balanceTransaction, () => {
      this.transactionListeners.forEach((listener) => listener(balanceTransaction));
      this.fetchBalanceAccounts(); // will trigger the state update
    }, [balanceAccount.id]);
  }

  getState() {
    return this.state;
  }

  setState(newState: BalanceAccount[]) {
    console.log("[BalanceAccountState] Setting the state to new state...", newState);
    this.state = [...newState];
    this.listeners.forEach((listener) => listener(this.state));
  }

  getTransactionState() {
    return this.transactionState;
  }

  setTransactionState(newState: BalanceAccountTransaction[]) {
    console.log("[BalanceAccountState] Setting the transaction state to new state...", newState);
    this.transactionState = [...newState];
    this.transactionListeners.forEach((transactionListener) => transactionListener(this.transactionState));
  }

  fetchBalanceAccounts() {
    this.restClient.genericFetch<BalanceAccount[]>([]).then((data) => {
      console.log('[BalanceAccountState] Data: ', data);
      this.setState(data);
    }).catch((error) => {
      console.error('[BalanceAccountState] Error:', error);
      this.setState([]);
    });
  }

  addListener(listener: (balanceAccount: BalanceAccount[]) => void) {
    this.listeners.push(listener);
  }

  removeListener(listener: (balanceAccount: BalanceAccount[]) => void) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  addTransactionListener(transactionListener: (balanceTransaction: BalanceAccountTransaction[]) => void) {
    this.transactionListeners.push(transactionListener);
  }

  removeTransactionListener(transactionListener: (balanceTransaction: BalanceAccountTransaction[]) => void) {
    this.transactionListeners = this.transactionListeners.filter((l) => l !== transactionListener);
  }
}