/*
    Budgeta Application
    Copyright (C) 2023 Budgeta Authors

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

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
@Document(collection = "balance_transactions")
public class BalanceTransaction extends DocumentInfo {

    @NotNull
    private BalanceTransactionType type;

    public BalanceTransaction(String id, @NotNull String name, @NotNull String description, @NotNull BigDecimal value,
                              Date updatedAt, BalanceTransactionType type, @NotNull String dashboardId) {
        super(id, name, description, value, updatedAt, dashboardId);
        this.type = type;
    }

    public enum BalanceTransactionType {
        WITHDRAW,
        DEPOSIT
    }


}
