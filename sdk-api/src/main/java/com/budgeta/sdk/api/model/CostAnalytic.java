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
package com.budgeta.sdk.api.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Document(collection = "cost_analytics")
public class CostAnalytic { // TODO can simply extend DocumentInfo, fix it

    @Id
    private String id;

    /**
     * Basically it holds the CostAnalytic name, representing the DTO itself.
     */
    @NotNull
    private String name;

    /**
     * Target unexpected is the amount of money which must be, or marked to be saved for the month.
     * Based on this value, when changed - all the Expenses and Savings will be re-calculated.
     * The user must update this value.
     */
    @NotNull
    private BigDecimal targetSaving;

    /**
     * Daily recommended is the amount of money which is calculated based on the:
     * (Incomes - (Expenses + Savings + Unexpected)) / days in month.
     * This is the maximum amount of money that should be spent daily (e.g. not exceed).
     * The value is not supposed to be updated by the user. It is calculated and read by the app.
     */
    @NotNull
    private BigDecimal dailyRecommended;

    /**
     * Monthly target is the amount of money which needs to be spent over the month.
     * This value is calculated based on the (Incomes - (Expenses + Savings + Unexpected)).
     * The value is not supposed to be updated by the user. It is calculated and read by the app.
     */
    @NotNull
    private BigDecimal monthlyTarget;

    /**
     * Balance account stores the saved money each month. It is calculated based on the {@link targetSaving},
     * automatically at the end of each month or manually updated by user.
     */
    @NotNull
    private BigDecimal balanceAccount; // TODO replaced by BalanceAccount, remove it as its no longer used

    /**
     * Provides reference to its corresponding dashboard
     */
    @NotNull
    private String dashboardId;
}
