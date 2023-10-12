import RestClient from "../api/RestClient";
import BalanceTransaction from "../data/classes/BalanceTransaction";
import config from  '../resources/config';
import { calculateDailyRecommended } from "../utils/CostAnalyticUtil";
import StateFactory from "./StateFactory";

export default class CostAnalyticState {

  /**
   * 
   * @param {StateFactory} stateFactory 
   */
  constructor(stateFactory) {
    this.state = {};
    this.listeners = [];
    this.restClient = new RestClient(config.api.costAnalyticEndpoint);
    this.expensesState = stateFactory.getExpensesState();
    this.incomesState = stateFactory.getIncomesState();
    this.unexpectedState = stateFactory.getUnexpectedState();
    this.balanceAccountState = stateFactory.getBalanceAccountState();

    this.incomesState.addListener(this.onChangeCalculateDailyRecommended.bind(this));
    this.expensesState.addListener(this.onChangeCalculateDailyRecommended.bind(this));
    this.unexpectedState.addListener(this.onChangeCalculateDailyRecommended.bind(this));
    this.balanceAccountState.addTransactionListener(this.onChangeUpdateBalanceAccount.bind(this));

    //TODO review this listener, if they are only need to update the cost analytics and fix it
    this.expensesState.addSaveListener(this.updateCostAnalytic.bind(this));
    this.unexpectedState.addSaveListener(this.updateCostAnalytic.bind(this));
    this.incomesState.addSaveListener(this.updateCostAnalytic.bind(this));
    
    this.restClient.genericFetch().then((data) => {
      this.setState(data);
    });
  }

  onChangeUpdateBalanceAccount(balanceTransaction) {
    console.log("[CostAnalyticState] Update balance account with: ", balanceTransaction);
    if(balanceTransaction.type === 'WITHDRAW'){
      this.state.balanceAccount -= Number(balanceTransaction.value);
    } else {
      this.state.balanceAccount += Number(balanceTransaction.value);
    }
    this.updateCostAnalytic();
  }

  /**
   * Updates the dailyRecommended dinamically. Will not store the value to DB.
   * The calculation is based on the following equasion:  x = ((i - (e+u+t)) / daysInCurrentMonth)
   * 
   * Note: Tipically this function is set as a callback to a listener when some of the following is updated:
   *  - expenses
   *  - incomes
   *  - unexpected
   *  - targetSaving
   * 
   */
  onChangeCalculateDailyRecommended() {
    const costAnalytic = calculateDailyRecommended(this.expensesState.getState(), 
    this.incomesState.getState(), this.unexpectedState.getState(), this.state);
    this.setState(costAnalytic);
  }

  /**
   * Updates the Target Saving dynamically. Will not store the value to DB.
   * This function also updates the CostAnalyticState.
   * 
   * @param {Number} targetSaving 
   */
  onChangeTargetSaving(targetSaving) {
    this.state.targetSaving = targetSaving;
    this.onChangeCalculateDailyRecommended();
  }

  /**
   * Save the state to DB. This will make a Rest Call to the backend.
   * The function will also set the state if operation succeed
   * 
   */
  updateCostAnalytic() {
    console.log(`[CostAnalyticState] Saving the state to backend: ${this.state}`);
    this.restClient.genericEdit(this.state, () => {
       this.setState(this.state);
    });
  }

  /**
   * Change the state dynamically. This will NOT store the new state to DB.
   * use {@link updateCostAnalytic} to do that.
   * 
   * @param {CostAnalyticState} newState 
   */
  setState(newState) {
    console.log("[CostAnalyticState] Setting the state to new state...", newState);
    this.state = structuredClone(newState);
    console.log('[CostAnalyticState] Listeners: ', this.listeners.length);
    this.listeners.forEach((listener) => listener(this.state)); // Notify all listeners that the state has changed
  }

  getState() {
    return this.state;
  }

  addListener(listener) {
    console.log("[CostAnalyticState] Added listener to state class");
    this.listeners.push(listener);
  }

  removeListener(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }
}