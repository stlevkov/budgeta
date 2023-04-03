import { getBalanceTransactions } from "../api/RestClient";

export default class BalanceAccountState {
  constructor() {
    this.state = [];
    this.listeners = [];

    getBalanceTransactions().then((data) => {
      this.setState(data);
    });
  }

  setState(newState) {
    console.log("[BalanceAccountState] Setting the state to new state...", newState);
    this.state = [...newState];
    this.listeners.forEach((listener) => listener(this.state));
  }

  getState() {
    return this.state;
  }

  addListener(listener) {
    this.listeners.push(listener);
  }

  removeListener(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }
}