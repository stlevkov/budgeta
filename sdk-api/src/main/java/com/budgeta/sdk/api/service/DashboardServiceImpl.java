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
import com.budgeta.sdk.api.model.Dashboard;
import com.budgeta.sdk.api.repository.DashboardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.ConstraintViolationException;
import java.util.List;

@Service
public class DashboardServiceImpl implements DashboardService{

    @Autowired
    private DashboardRepository dashboardRepo;

    @Override
    public Dashboard createDashboard(Dashboard dashboard) throws ConstraintViolationException {
        System.out.println("Trying to create new dashboard: " + dashboard);
        System.out.println("Creating dashboard from the service");
        return dashboardRepo.save(dashboard);
    }

    @Override
    public Dashboard getCurrentDashboard(int currentYear, String currentMonth) throws ConstraintViolationException, ValidationCollectionException {
        List<Dashboard> dashboards = dashboardRepo.findByYearAndMonth(currentYear, currentMonth);
        if(dashboards.size() == 1) {
            return dashboards.get(0);
        } else {
            throw new ValidationCollectionException("Unable to found dashboards with given year, month: " + currentYear + ", " + currentMonth);
        }
    }
}
