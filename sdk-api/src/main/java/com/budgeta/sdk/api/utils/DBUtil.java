/*
    Budgeta Application
    Copyright (C) 2022 - 2024  S.Levkov, K.Ivanov

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
 */
package com.budgeta.sdk.api.utils;

import com.budgeta.sdk.api.model.Dashboard;
import com.budgeta.sdk.api.model.Expense;
import com.budgeta.sdk.api.model.Income;
import com.budgeta.sdk.api.model.Unexpected;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public final class DBUtil {

    public static List<Expense> getExpenseList(final Dashboard dashboardSave1, final Dashboard dashboardSave2) {
        List<Expense> expenses = new ArrayList<>();
        Expense expense = new Expense(null, "Loan", "Test Description", BigDecimal.valueOf(870), new Date(), dashboardSave1.getId());
        expenses.add(expense);
        Expense expense1 = new Expense(null, "Another Expense1", "Another Description", BigDecimal.valueOf(500), new Date(), dashboardSave1.getId());
        expenses.add(expense1);
        Expense expense2 = new Expense(null, "Another Expense2", "Another Another Description", BigDecimal.valueOf(980), new Date(), dashboardSave1.getId());
        expenses.add(expense2);
        Expense expense3 = new Expense(null, "Loan", "Test Description", BigDecimal.valueOf(870), new Date(), dashboardSave2.getId());
        expenses.add(expense3);
        Expense expense4 = new Expense(null, "Another Expense1", "Another Description", BigDecimal.valueOf(500), new Date(), dashboardSave2.getId());
        expenses.add(expense4);
        Expense expense5 = new Expense(null, "Another Expense2", "Another Another Description", BigDecimal.valueOf(980), new Date(), dashboardSave2.getId());
        expenses.add(expense5);
        return expenses;
    }

    public static List<Unexpected> getUnexpectedList(final Dashboard dashboardSave1, final Dashboard dashboardSave2) {
        List<Unexpected> unexpecteds = new ArrayList<>();
        Unexpected unexpected = new Unexpected(null, "Birthday", "Test Descr Birthday", BigDecimal.valueOf(200), new Date(), dashboardSave1.getId());
        unexpected.setLocation("unknown");
        unexpected.setPurpose("unknown");
        unexpecteds.add(unexpected);
        Unexpected unexpected2 = new Unexpected(null, "Vacation", "Test Descr Vacation", BigDecimal.valueOf(100), new Date(), dashboardSave2.getId());
        unexpected2.setLocation("unknown");
        unexpected2.setPurpose("unknown");
        unexpecteds.add(unexpected2);
        return unexpecteds;
    }

    public static List<Income> getIncomeList(final Dashboard dashboardSave1, final Dashboard dashboardSave2) {
        List<Income> incomes = new ArrayList<>();
        incomes.add(new Income(null, "Salary 1", "Salary Description", BigDecimal.valueOf(1500), new Date(), dashboardSave1.getId()));
        incomes.add(new Income(null, "Salary 2", "Salary 2 descr", BigDecimal.valueOf(4000), new Date(), dashboardSave1.getId()));
        incomes.add(new Income(null, "Salary 1", "Salary Description", BigDecimal.valueOf(1700), new Date(), dashboardSave2.getId()));
        incomes.add(new Income(null, "Salary 2", "Salary 2 descr", BigDecimal.valueOf(4200), new Date(), dashboardSave2.getId()));
        return incomes;
    }
}
