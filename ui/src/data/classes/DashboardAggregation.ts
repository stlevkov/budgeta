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
import Dashboard from "./Dashboard";

export default class DashboardAggregation extends Dashboard {

  public totalExpenses: number

  private totalUnexpecteds: number;

  private targetSaving: number;

  constructor(
    id: string,
    month: string,
    year: number,
    readOnly: boolean,
    totalExpenses: number,
    totalUnexpecteds: number,
    targetSaving: number
  ) {
    super(id, month, year, readOnly);

    this.totalExpenses = totalExpenses;
    this.totalUnexpecteds = totalUnexpecteds;
    this.targetSaving = targetSaving;
  }

}