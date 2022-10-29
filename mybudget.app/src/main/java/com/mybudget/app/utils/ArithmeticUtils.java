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
package com.mybudget.app.utils;

import com.mybudget.app.model.Expense;
import com.mybudget.app.model.Income;
import com.mybudget.app.model.Saving;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;


public final class ArithmeticUtils {

    private ArithmeticUtils(){
        // hide
    }

    public static BigDecimal sumSavings(final List<Saving> savings){
        BigDecimal sumSavings = BigDecimal.ZERO;
        for(Saving saving : savings){
            sumSavings = sumSavings.add(saving.getValue());
        }
        return sumSavings.setScale(2, RoundingMode.HALF_EVEN);
    }

    public static BigDecimal sumIncomes(final List<Income> incomes){
        BigDecimal sumIncomes = BigDecimal.ZERO;
        for(Income income : incomes){
            sumIncomes = sumIncomes.add(income.getValue());
        }
        return sumIncomes.setScale(2, RoundingMode.HALF_EVEN);
    }

    public static BigDecimal sumExpenses(final List<Expense> expenses){
        BigDecimal sum = BigDecimal.ZERO;
        for(Expense expense : expenses) {
            sum = sum.add(expense.getValue());
        }
        return sum.setScale(2, RoundingMode.HALF_EVEN);
    }
}
