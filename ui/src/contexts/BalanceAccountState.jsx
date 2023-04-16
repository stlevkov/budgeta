import RestClient from "../api/RestClient";
import config from "../resources/config.json";

export default class BalanceAccountState {
  constructor() {
    this.state = [];
    this.listeners = [];
    this.restClient = new RestClient(config.api.balanceTransactionEndpoint);

    this.restClient.genericFetch().then((data) => {
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