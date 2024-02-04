import RestClient from "../api/RestClient";
import config from '../resources/config';
import StateFactory from "./StateFactory";
import Setting from "../data/classes/Setting";
import FactoryInitializable from "../data/interfaces/FactoryInitializable";

export default class SettingState implements FactoryInitializable<SettingState> {
  private state: Setting;
  private listeners: Function[] = [];
  private restClient: RestClient;
  private restClientInitDashboard: RestClient;
  private factory?: StateFactory<SettingState>; // Added factory property

  constructor(stateFactory: StateFactory<SettingState>) {
    this.restClient = new RestClient(config.api.dashboardEndpoint);
    this.restClientInitDashboard = new RestClient(config.api.settingsInitDashboardEndpoint);
    this.factory = stateFactory; // Set the factory property
  }

  onFactoryReady(factory: StateFactory<any>): void {
    // Implement the onFactoryReady method as needed
  }

  createInitDashboard(callback: Function, month: string, year: number): void {
    console.log('[SettingState] Creating initial dashboard.');
    this.restClientInitDashboard.genericFetch<[]>([]).then((data) => {
      callback(data);
    }).catch((error) => {
      console.log('[SettingState] unable to create init dashboard: ', error);
    });
  }

  // Additional methods and properties as needed
}
