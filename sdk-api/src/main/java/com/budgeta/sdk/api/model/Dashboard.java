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

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Document(collection = "dashboards")
public class Dashboard {

    @Id
    private String id;

    @NotNull
    private Integer month;

    @NotNull
    private Integer year;

    @NotNull
    private Boolean readOnly;

    private Double totalExpenses;

    private Double totalUnexpecteds;

    private Double targetSaving;

    public Dashboard(@NotNull String id, @NotNull Integer month, @NotNull Integer year, @NotNull Boolean readOnly) {
        this.id = id;
        this.month = month;
        this.year = year;
        this.readOnly = readOnly;
    }

}
