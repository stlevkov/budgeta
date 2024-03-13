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

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
@Document(collection = "balance_transactions")
public class BalanceAccountTransaction extends DocumentInfo {

    public static final String DEPOSIT = "DEPOSIT";
    public static final String WITHDRAW = "WITHDRAW";
    public static final String USER_UPDATE = "Balance update by User";
    public static final String SYSTEM_UPDATE = "Balance update by the System Dashboard Creation Mechanism";
    public static final String SYSTEM_UPDATE_DESCR = "The account balance has been transferred from the last Dashboard with adding the target saving";

    @NotNull
    private String type;

    @NotNull
    private BalanceAccount balanceAccount;

    public BalanceAccountTransaction(String id, @NotNull String name, @NotNull String description, @NotNull BigDecimal value,
                                     Date updatedAt, @NotNull String type, @NotNull BalanceAccount balanceAccount, @NotNull String dashboardId) {
        super(id, name, description, value, updatedAt, dashboardId);
        this.type = type;
    }

}
