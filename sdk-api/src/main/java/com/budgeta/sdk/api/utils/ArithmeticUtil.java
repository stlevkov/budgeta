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
package com.budgeta.sdk.api.utils;

import com.budgeta.sdk.api.model.Expense;
import com.budgeta.sdk.api.model.Income;
import com.budgeta.sdk.api.model.Unexpected;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;


public final class ArithmeticUtil {

    private ArithmeticUtil(){
        // hide
    }

    public static BigDecimal sumSavings(final List<Unexpected> unexpecteds){
        BigDecimal sumSavings = BigDecimal.ZERO;
        for(Unexpected unexpected : unexpecteds){
            sumSavings = sumSavings.add(unexpected.getValue());
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
