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
import com.budgeta.sdk.api.model.BalanceTransaction;
import com.budgeta.sdk.api.model.CostAnalytic;
import com.budgeta.sdk.api.model.Dashboard;
import com.budgeta.sdk.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.ConstraintViolationException;
import java.math.BigDecimal;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class CostAnalyticServiceImpl implements CostAnalyticService {

    @Autowired
    private CostAnalyticRepository costAnalyticRepo;
    @Autowired
    private ExpenseRepository expenseRepository;
    @Autowired
    private IncomeRepository incomeRepository;
    @Autowired
    private UnexpectedRepository unexpectedRepository;
    @Autowired
    private DashboardRepository dashboardRepository;

    @Override
    public void createCostAnalytic(CostAnalytic costAnalytic) throws ConstraintViolationException, ValidationCollectionException {
        System.out.println("Trying to create CostAnalytic: " + costAnalytic);
        costAnalyticRepo.save(costAnalytic);
    }

    @Override
    public void updateCostAnalytic(CostAnalytic costAnalytic) throws ConstraintViolationException, ValidationCollectionException {
        Optional<CostAnalytic> costAnalyticOptional = costAnalyticRepo.findById(costAnalytic.getId());
        if (costAnalyticOptional.isPresent()) {
            costAnalyticRepo.save(costAnalytic);
        } else {
            throw new ValidationCollectionException(ValidationCollectionException.notFound(costAnalytic.getId()));
        }
    }

    @Override
    public CostAnalytic getCurrentCostAnalytic(final int currentYear, final int currentMonth) throws ValidationCollectionException {

        List<Dashboard> dashboards = dashboardRepository.findByYearAndMonth(currentYear, currentMonth);
        if(dashboards.size() == 1) {
            final String dashboardId = dashboards.get(0).getId();
            List<CostAnalytic> costAnalytics = costAnalyticRepo.findByDashboardId(dashboardId);
            if(costAnalytics.size() == 1) {
                return costAnalytics.get(0);
            } else {
                throw new ValidationCollectionException(("Cannot find cost analytic with given dashboardId: " + dashboardId));
            }
        } else {
            throw new ValidationCollectionException("Cannot find dashboard with given year and month: "+ currentYear + ", " + currentMonth);
        }
    }

}
