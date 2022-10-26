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
package com.mybudget.app.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@Setter
@Getter
@AllArgsConstructor
@ToString
@Document(collection = "cost_analytics")
public class CostAnalytic {

    @Id
    private String id;

    /**
     * Target saving is the amount of money which must be, or marked to be saved for the month.
     * Based on this value, when changed - all the Expenses and Savings will be re-calculated.
     */
    @NotNull
    private BigDecimal targetSaving;

    /**
     * Daily recommended is the amount of money which is calculated based on the:
     * (Incomes - (Expenses + Savings)) / 30.
     * This is the maximum amount of money that should be spent daily.
     * The value is not supposed to be updated by the user. It is calculated and read by the app.
     */
    @NotNull
    private BigDecimal dailyRecommended;

    /**
     * Monthly target is the amount of money which needs to be spent over the month. This value is calculated
     * based on the (Incomes - (Expenses + Savings)).
     */
    @NotNull
    private BigDecimal monthlyTarget;

    /**
     * All expenses are the amount of money which is marked to be spent for the month. The value is calculated
     * based on the sum of the Expenses.
     */
    @NotNull
    private BigDecimal allExpenses;
}
