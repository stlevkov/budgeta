import CostAnalyticState from "./CostAnalyticState";
import IncomesState from "./IncomesState";
import ExpensesState from "./ExpensesState";
import UnexpectedState from "./UnexpectedState";
import BalanceAccountState from "./BalanceAccountState";

export default class StateFactory {
  constructor() {
    this._costAnalyticState = null;
    this._incomesState = null;
    this._expensesState = null;
    this._unexpectedState = null;
    this._balanceAccountState = null;
  }

  createCostAnalyticState() {
    this._costAnalyticState = new CostAnalyticState(this);
    return this._costAnalyticState;
  }

  createIncomesState() {
    this._incomesState = new IncomesState(this);
    console.log('StateFactory: created IncomesState: ', this._incomesState);
    return this._incomesState;
  }

  createExpensesState() {
    this._expensesState = new ExpensesState(this);
    return this._expensesState;
  }

  createUnexpectedState() {
    this._unexpectedState = new UnexpectedState(this);
    return this._unexpectedState;
  }

  createBalanceAccountState() {
    this._balanceAccountState = new BalanceAccountState(this);
    return this._balanceAccountState;
  }

  getCostAnalyticState() {
    return this._costAnalyticState;
  }

  getIncomesState() {
    console.log('StateFactory: someone calls getIncomesState, returning: ', this._incomesState);
    return this._incomesState;
  }

  getExpensesState() {
    return this._expensesState;
  }

  getUnexpectedState() {
    return this._unexpectedState;
  }

  getBalanceAccountState() {
    return this._balanceAccountState;
  }
}
