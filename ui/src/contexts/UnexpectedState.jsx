import RestClient from "../api/RestClient";
import config from "../resources/config.json";
import StateFactory from "./StateFactory";

/** Represents an Unexpected State */
export default class UnexpectedState {
  /**
   * @constructor
   * @param {StateFactory} stateFactory - To access another states if need
   * @param {Array} state - The state of the unexpected
   * @param {Array} listeners - The listeners stack used to hold listeners
   * @param sumUnexpected - the sum of all unexpected in the state
   */
  constructor(stateFactory) {
    this.state = [];
    this.listeners = [];
    this.saveListeners = [];
    this.sumUnexpected = undefined;
    this.restClient = new RestClient(config.api.unexpectedEndpoint);

    this.restClient.genericFetch().then((data) => {
      this.setState(data);
    });
  }

  /**
   * Set the new state. Also calculates the sumUnexpected. Use getSumUnexpected to get the calculated sum.
   *
   * @param newState new unexpected array
   */
  setState(newState) {
    console.log("[UnexpectedState] Setting the state to new state...", newState);
    this.sumUnexpected = newState.map((newState) => parseInt(newState.value, 10)).reduce((a, b) => a + b);
    this.state = [...newState];
    this.listeners.forEach((listener) => listener(this.state)); // Notify all listeners that the state has changed
  }

  /**
   * Get the current state of the unexpected.
   *
   * @returns {Array} The current state of the object.
   */
  getState() {
    return this.state;
  }

  /**
   * Get the sum of unexpected stored in the state.
   *
   * @returns {number} The sum of unexpected in the state.
   */
  getSumUnexpected() {
    return this.sumUnexpected;
  }

  /**
   * Stores the value to the DB and Update the unexpected state if succeed.
   * Also notifies the save listeners.
   * 
   * @see {@link addSaveListener} 
   *
   * @param unexpected single unexpected
   */
  updateUnexpected(unexpected) {
    this.restClient.genericEdit(unexpected, () => {
      this.state.map((item) => {
        return item.id === unexpected.id ? unexpected : item;
      });
      this.setState(this.state);
      this.saveListeners.forEach((saveListener) => saveListener(this.state));
    });
  }

  /**
  * Updating the state on value change event. This function will not save the value to DB.
  * After the dynamic change complete, or upon ENTER, please invoke {@link updateUnexpected}
  *
  * @param unexpected dto
  */
  onChange(unexpected) {
    console.log('Unexpected candidate: ', unexpected)
    this.state.map((item) => {
      return item.id === unexpected.id ? unexpected : item;
    });
    this.setState(this.state);
  }

  /**
   * Add new value to the state
   *
   * @param unexpected single expense
   */
  addUnexpected(unexpected) {
    this.restClient.genericCreate(unexpected, () => {
      this.setState([...this.state, unexpected]);
      this.saveListeners.forEach((saveListener) => saveListener(this.state));
    });

  }

  /**
   * Remove the unexpected from DB and updates the state if succeed.
   * Also notify the state save listeners.
   * 
   * @see {@link addSaveListener}
   *
   * @param unexpected single unexpected
   */
  removeUnexpected(unexpected) {
    this.restClient.genericDelete(unexpected, () => {
      var index = this.state.indexOf(unexpected);
      if (index !== -1) {
        this.state.splice(index, 1);
      }
      this.setState(this.state);
      this.saveListeners.forEach((saveListener) => saveListener(this.state));
    });

  }

  /**
   * Adding new listener to be notified when state change
   *
   * @param listener the new listener
   */
  addListener(listener) {
    this.listeners.push(listener);
  }

  /**
   * Removing a listener from the listeners stack
   *
   * @param listener the listener to be removed
   */
  removeListener(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  addSaveListener(saveListener) {
    this.saveListeners.push(saveListener);
  }

  removeSaveListener(saveListener) {
    this.saveListeners = this.saveListeners.filter((l) => l !== saveListener);
  }
}
