import RestClient from "../api/RestClient";
import FactoryInitializable from "../data/interfaces/FactoryInitializable";
import config from  '../resources/config';
import { calculateDailyRecommended } from "../utils/CostAnalyticUtil";
import BalanceAccountState from "./BalanceAccountState";
import ExpensesState from "./ExpensesState";
import IncomesState from "./IncomesState";
import StateFactory from "./StateFactory";
import UnexpectedState from "./UnexpectedState";
import CostAnalytic from "../data/classes/CostAnalytic";
import DashboardListener from "../data/interfaces/DashboardListener";
import Dashboard from "../data/classes/Dashboard";
import BalanceAccountTransaction from "../data/classes/BalanceAccountTransaction";
import DashboardState from "./DashboardState";

export default class CostAnalyticState implements DashboardListener, FactoryInitializable<CostAnalyticState>{
  private state: CostAnalytic | any;
  private listeners: ((state: CostAnalytic) => void)[];
  private saveListeners: ((state: CostAnalytic) => void)[];
  private restClient: RestClient;
  private expensesState: ExpensesState | any;
  private incomesState: IncomesState | any;
  private unexpectedState: UnexpectedState | any;
  private balanceAccountState: BalanceAccountState | any;
  private dashboardState: DashboardState | any;

  /**
   * 
   * @param {StateFactory} stateFactory 
   */
  constructor(stateFactory: StateFactory<any>) {
    this.state = {};
    this.listeners = [];
    this.saveListeners = [];
    this.restClient = new RestClient(config.api.costAnalyticEndpoint);
  }

  onDashboardStateChange(dashboard: Dashboard): void {
    this.restClient.genericFetch<CostAnalytic[]>([dashboard.id]).then((data) => {
      this.setState(data);
    }).catch((error) => {
      console.error('[CostAnalyticState][onDashboardStateChange] Error:', error);
      this.setState([]);
    });
  }

  onFactoryReady(stateFactory: StateFactory<any>): void {
    this.expensesState = stateFactory.getState(ExpensesState);
    this.incomesState = stateFactory.getState(IncomesState);
    this.unexpectedState = stateFactory.getState(UnexpectedState);
    this.balanceAccountState = stateFactory.getState(BalanceAccountState);
    this.dashboardState = stateFactory.getState(DashboardState);

    this.dashboardState.addListener(this.onDashboardStateChange.bind(this));
    this.incomesState.addListener(this.onChangeCalculateDailyRecommended.bind(this));
    this.expensesState.addListener(this.onChangeCalculateDailyRecommended.bind(this));
    this.unexpectedState.addListener(this.onChangeCalculateDailyRecommended.bind(this));
    this.balanceAccountState.addTransactionListener(this.onChangeUpdateBalanceAccount.bind(this));

    // Listeners when the user wants to actually save the changed values
    this.expensesState.addSaveListener(this.updateCostAnalytic.bind(this));
    this.unexpectedState.addSaveListener(this.updateCostAnalytic.bind(this));
    this.incomesState.addSaveListener(this.updateCostAnalytic.bind(this));
  
  }

  onChangeUpdateBalanceAccount(balanceTransaction: BalanceAccountTransaction) {
    console.log("[CostAnalyticState] Update balance account with: ", balanceTransaction);
    if (balanceTransaction.type === 'WITHDRAW') {
      this.state.balanceAccount -= Number(balanceTransaction.value);
    } else {
      this.state.balanceAccount += Number(balanceTransaction.value);
    }
    this.updateCostAnalytic();
  }

  /**
   * Updates the dailyRecommended dynamically. Will not store the value to DB.
   * The calculation is based on the following equation:  x = ((i - (e+u+t)) / daysInCurrentMonth)
   * 
   * Note: Typically this function is set as a callback to a listener when some of the following is updated:
   *  - expenses
   *  - incomes
   *  - unexpected
   *  - targetSaving
   * 
   */
  onChangeCalculateDailyRecommended() {
    console.log('[CostAnalyticState][onChangeCalculateDailyRecommended] calculating daily recomended...')
    const costAnalytic = calculateDailyRecommended(this.expensesState.getSumExpenses(),
    this.incomesState.getSumIncomes(), this.unexpectedState.getSumUnexpecteds(), this.state);
    this.setState(costAnalytic);
  }

  /**
   * Updates the Target Saving dynamically. Will not store the value to DB.
   * This function also updates the CostAnalyticState.
   * 
   * @param {number} targetSaving 
   */
  onChangeTargetSaving(targetSaving: number) {
    console.log('[CostAnalyticState][onChangeTargetSaving] target saving: ', targetSaving);
    this.state.targetSaving = targetSaving;
    this.onChangeCalculateDailyRecommended();
  }

  /**
   * Save the state to DB. This will make a Rest Call to the backend.
   * The function will also set the state if the operation succeeds
   * 
   */
  updateCostAnalytic() {
    console.log(`[CostAnalyticState] Saving the state to the backend: ${this.state}`);
    this.restClient.genericEdit(this.state, () => {
       this.setState(this.state);
       this.saveListeners.forEach((listener) => listener(this.state)); // notify save listeners upon save in DB
    });
  }

  /**
   * Change the state dynamically. This will NOT store the new state to DB.
   * use {@link updateCostAnalytic} to do that.
   * 
   * @param {Record<string, any>} newState 
   */
  setState(newState: Record<string, any>) {
    console.log("[CostAnalyticState] Setting the state to new state...", newState);
    this.state = { ...newState };
    console.log('[CostAnalyticState] Listeners: ', this.listeners.length);
    this.listeners.forEach((listener) => listener(this.state));
  }

  getState(): Record<string, any> {
    return this.state;
  }

  addListener(listener: (state: Record<string, any>) => void) {
    console.log("[CostAnalyticState] Someone just added an listener to CostAnalytic state class: ", listener);
    this.listeners.push(listener);
  }

  addSaveListener(listener: (state: Record<string, any>) => void) {
    console.log("[CostAnalyticState] Someone just added an Save listener to CostAnalytic state class: ", listener);
    this.saveListeners.push(listener);
  }

  removeListener(listener: (state: Record<string, any>) => void) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  removeSaveListener(listener: (state: Record<string, any>) => void) {
    this.saveListeners = this.saveListeners.filter((l) => l !== listener);
  }
}
