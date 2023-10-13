/*
    Budgeta Application
    Copyright (C) 2022  S.K.Levkov, K.K.Ivanov

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
 */
package com.budgeta.sdk.api.service;

import com.budgeta.sdk.api.exception.ValidationCollectionException;
import com.budgeta.sdk.api.model.Expense;

import javax.validation.ConstraintViolationException;
import java.util.List;

public interface ExpenseService {

    List<Expense> getByDashboardId(String dashboardId) throws ConstraintViolationException, ValidationCollectionException;

    void createExpense(Expense expense) throws ConstraintViolationException, ValidationCollectionException;

    void updateExpense(Expense expense) throws ConstraintViolationException, ValidationCollectionException;
}
