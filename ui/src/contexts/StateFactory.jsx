import CostAnalyticState from "./CostAnalyticState";
import IncomesState from "./IncomesState";
import ExpensesState from "./ExpensesState";
import UnexpectedState from "./UnexpectedState";
import BalanceAccountState from "./BalanceAccountState";
import DashboardState from "./DashboardState";

export default class StateFactory {
  constructor() {
    this.costAnalyticState = null;
    this.incomesState = null;
    this.expensesState = null;
    this.unexpectedState = null;
    this.balanceAccountState = null;
    this.dashboardState = null;
  }

  createCostAnalyticState() {
    this.costAnalyticState = new CostAnalyticState(this);
    return this.costAnalyticState;
  }

  createIncomesState() {
    this.incomesState = new IncomesState(this);
    return this.incomesState;
  }

  createExpensesState() {
    this.expensesState = new ExpensesState(this);
    return this.expensesState;
  }

  createUnexpectedState() {
    this.unexpectedState = new UnexpectedState(this);
    return this.unexpectedState;
  }

  createBalanceAccountState() {
    this.balanceAccountState = new BalanceAccountState(this);
    return this.balanceAccountState;
  }

  createDashboardState() {
    this.dashboardState = new DashboardState(this);
    return this.dashboardState;
  }

  getCostAnalyticState() {
    if(this.costAnalyticState === null) {
      return this.createCostAnalyticState();
    }
    return this.costAnalyticState;
  }

  getIncomesState() {
    if(this.incomesState === null) {
      return this.createIncomesState();
    }
    return this.incomesState;
  }

  getExpensesState() {
    if(this.expensesState === null) {
      return this.createExpensesState();
    }
    return this.expensesState;
  }

  getUnexpectedState() {
    if(this.unexpectedState === null) {
      return this.createUnexpectedState();
    }
    return this.unexpectedState;
  }

  getBalanceAccountState() {
    if(this.balanceAccountState === null) {
      return this.createBalanceAccountState();
    }
    return this.balanceAccountState;
  }

  getDashboardState() {
    if(this.dashboardState === null) {
      return this.createDashboardState();
    }
    return this.dashboardState;
  }
}
