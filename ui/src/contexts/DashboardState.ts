/*
    Budgeta Application
    Copyright (C) 2022 - 2023  S.Levkov, K.Ivanov

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
 */
import RestClient from "../api/RestClient";
import Dashboard from "../data/classes/Dashboard";
import DashboardAggregation from "../data/classes/DashboardAggregation";
import config from  '../resources/config';
import IncomesState from "./IncomesState";
import StateFactory from "./StateFactory";
import dayjs from 'dayjs';
import UnexpectedState from "./UnexpectedState";
import ExpensesState from "./ExpensesState";
import FactoryInitializable from "../data/interfaces/FactoryInitializable";

export default class DashboardState implements FactoryInitializable<DashboardState> {
  private state: Dashboard;
  private aggregationState: DashboardAggregation[];
  private listeners: Function[] = [];
  private aggregationListeners: Function[] = [];
  private restClient: RestClient;
  private restClientAggregation: RestClient;
  private incomeState: IncomesState | any;
  private unexpectedState: UnexpectedState | any;
  private expenseState: ExpensesState | any;

  private currentDate: dayjs.Dayjs;
  private month: string;
  private year: number;

  constructor(stateFactory: StateFactory<DashboardState>) {
    this.restClient = new RestClient(config.api.dashboardEndpoint);
    this.restClientAggregation = new RestClient(config.api.dashboardAggregatedEndpoint);
    this.currentDate = dayjs();
    this.month = this.currentDate.format('MMMM');
    this.year = Number(this.currentDate.format('YYYY'));
    this.handleStateChanged(this.month, this.year);
    this.handleAggregationChanged(2020); // TODO Adjust when slider for time frame is implemented
  }

  onFactoryReady(stateFactory: StateFactory<any>): void {
      console.log('[DashboardState] on factory in dashboard invoked');

      this.incomeState = stateFactory.getState(IncomesState);
      this.unexpectedState = stateFactory.getState(UnexpectedState);
      this.expenseState = stateFactory.getState(ExpensesState);

      this.incomeState.addListener(this.onChangeFetchAggregation.bind(this));
      this.expenseState.addListener(this.onChangeFetchAggregation.bind(this));
      this.unexpectedState.addListener(this.onChangeFetchAggregation.bind(this));
  }

  onChangeFetchAggregation(): void {
     this.handleAggregationChanged(2020); // TODO Adjust when slider for time frame is implemented
  }

  getCurrentDate(): { month: string; year: number } {
    return { month: this.month, year: this.year };
  }

  handleAggregationChanged(year: number): void {
    console.log("[DashboardState] Handle aggregation timeline changed: ");
    this.restClientAggregation.genericFetch<DashboardAggregation[]>([]).then((data) => {  // TODO Adjust when slider for time frame is implemented
      console.log('[DashboardState][Aggregation] Data: ', data);
      this.setAggregationState(data);
    });
  }

  handleStateChanged(month: string, year: number): void {
    console.log("[DashboardState] Handle selected month changed: ", month + ' ' + year);
    console.log('[DashboardState] Fetching the dashboard item from DB...');
    this.restClient.genericFetch<Dashboard>([year, month]).then((data) => {
      console.log('[DashboardState] Data: ', data);
      this.setState(data);
    });
  }

  setAggregationState(newState: DashboardAggregation[]): void {
    console.log("[DashboardState] Setting the state to new state...", newState);
    this.aggregationState = newState;
    this.aggregationListeners.forEach((listener) => listener(this.aggregationState));
  }

  setState(newState: Dashboard): void {
    console.log("[DashboardState] Setting the state to new state...", newState);
    this.state = newState;
    this.listeners.forEach((listener) => listener(this.state));
  }

  getAggregationState(): DashboardAggregation[] {
    return this.aggregationState;
  }

  getState(): Dashboard {
    return this.state;
  }

  addListener(listener: (data: Dashboard) => void): void {
    this.listeners.push(listener);
  }

  addAggregationListener(listener: (data: DashboardAggregation[]) => void): void {
    this.aggregationListeners.push(listener);
  }

  removeListener(listener: (data: Dashboard) => void): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  removeAggregationListener(listener: (data: DashboardAggregation[]) => void): void {
    this.aggregationListeners = this.aggregationListeners.filter((l) => l !== listener);
  }
}
