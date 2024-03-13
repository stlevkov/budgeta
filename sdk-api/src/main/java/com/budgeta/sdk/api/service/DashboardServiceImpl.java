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
import com.budgeta.sdk.api.model.*;
import com.budgeta.sdk.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.ConstraintViolationException;
import java.util.Date;
import java.util.List;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private DashboardRepository dashboardRepo;

    @Autowired
    private CostAnalyticRepository costAnalyticRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private BalanceAccountTransactionRepository balanceAccountTransactionRepository;

    @Autowired
    private BalanceAccountService balanceAccountService;

    @Autowired
    private UserService userService;

    @Override
    public Dashboard createDashboard(Dashboard dashboard) throws ConstraintViolationException {
        System.out.println("Trying to create new dashboard: " + dashboard);
        System.out.println("Creating dashboard from the service");
        return dashboardRepo.save(dashboard);
    }

    @Override
    public Dashboard getCurrentDashboard(int currentYear, int currentMonth) throws ConstraintViolationException, ValidationCollectionException {
        List<Dashboard> dashboards = dashboardRepo.findByYearAndMonthAndUserId(currentYear, currentMonth, userService.getCurrentLoggedUser().getId());
        if (dashboards.size() == 1) {
            return dashboards.get(0);
        } else {
            throw new ValidationCollectionException("Unable to found dashboards with given year, month: " + currentYear + ", " + currentMonth);
        }
    }

    @Override
    public Dashboard transferDataAndCreateDashboard(int year, int month) throws ValidationCollectionException {
        String userId = userService.getCurrentLoggedUser().getId();
        System.out.println("[DashboardService] Trying to found the last dashboard to the specified period of: " + year + "-" + month);
        Dashboard closestDashboard = findClosestDashboard(year, month, userId);
        System.out.println("[DashboardService] Creating the new Dashboard...");
        Dashboard candidateDashboard = new Dashboard(null, month, year, true, userId);
        Dashboard savedDashboard = dashboardRepo.save(candidateDashboard);
        System.out.println("[DashboardService] Copying CostAnalytics...");
        copyCostAnalytics(closestDashboard, savedDashboard);
        System.out.println("[DashboardService] Copying Expenses...");
        copyExpenses(closestDashboard, savedDashboard);
        System.out.println("[DashboardService] Copying Incomes...");
        copyIncomes(closestDashboard, savedDashboard);
        System.out.println("[DashboardService] Returning the new Dashboard: " + savedDashboard);
        return savedDashboard;
    }

    @Override
    public List<Dashboard> getDashboards() {
        return dashboardRepo.findByUserId(userService.getCurrentLoggedUser().getId());
    }

    private void copyIncomes(final Dashboard closestDashboard, final Dashboard savedDashboard) {
        List<Income> incomes = incomeRepository.findByDashboardId(closestDashboard.getId());
        incomes.forEach(income -> {
            income.setId(null);
            income.setDashboardId(savedDashboard.getId());
            income.setUpdatedAt(new Date());
            incomeRepository.save(income);
        });
    }


    private void copyExpenses(final Dashboard closestDashboard, final Dashboard savedDashboard) {
        List<Expense> expenses = expenseRepository.findByDashboardId(closestDashboard.getId());
        expenses.forEach(expense -> {
            expense.setId(null); // to trigger new expense creation in DB
            expense.setDashboardId(savedDashboard.getId()); // changing to the new dashboard id
            expense.setUpdatedAt(new Date()); // updated
            expenseRepository.save(expense); // save the new expense to DB
        });
    }

    private void copyCostAnalytics(final Dashboard closestDashboard, final Dashboard savedDashboard) {
        CostAnalytic costAnalytic = costAnalyticRepository.findByDashboardId(closestDashboard.getId()).get(0);
        costAnalytic.setDashboardId(savedDashboard.getId()); // assign the new dashboard id
        costAnalytic.setId(null); // clear the entity id to trigger new object creation
        costAnalytic.setBalanceAccount(costAnalytic.getBalanceAccount().add(costAnalytic.getTargetSaving())); // Increasing the balance account
        CostAnalytic savedCostAnalytic = costAnalyticRepository.save(costAnalytic);
        System.out.println("Creating new balance transaction for the copy process...");
        BalanceAccountTransaction transaction;
        try {
            transaction = new BalanceAccountTransaction(null, "Increasing Amount",
                    BalanceAccountTransaction.SYSTEM_UPDATE_DESCR, costAnalytic.getTargetSaving(), new Date(),
                    BalanceAccountTransaction.SYSTEM_UPDATE, balanceAccountService.getPrimaryBalanceAccount().get(), savedDashboard.getId());
            balanceAccountTransactionRepository.save(transaction);
            System.out.println("Saved new CostAnalytic: " + savedCostAnalytic);
        } catch (ValidationCollectionException e) {
            System.out.println("ERROR: " + e.getMessage());
        }
    }

    private Dashboard findClosestDashboard(final int year, final int month, final String userId) throws ValidationCollectionException {
        System.out.println("Checking if there are records for this year: " + year + ", month: " + month);
        List<Dashboard> dashboardsForCurrentYear = dashboardRepo.findByYearAndUserIdOrderByMonthAsc(year, userId);
        System.out.println("Found dashboardsForCurrentYear: " + dashboardsForCurrentYear);
        if (month == 1 || dashboardsForCurrentYear.isEmpty()) {
            System.out.println("Target month is 1-January OR there are none records in the current year - " +
                    "will search only in the past year...");
            System.out.println("Getting only the last year records: " + (year - 1));
            List<Dashboard> byYear = dashboardRepo.findByYearAndUserIdOrderByMonthDesc(year - 1, userId);
            System.out.println("found by year for the pass year: " + byYear);
            if (byYear.isEmpty()) {
                throw new ValidationCollectionException("Unable to fetch data from the past 1 year. Check with Admin");
            }
            System.out.println("Returning the last closest dashboard: " + byYear.get(0));
            return byYear.get(0); // return the first index, while using Desc order
        }
        int closestMonthInCurrentYear = 0;

        for (Dashboard dashboard : dashboardsForCurrentYear) {
            // 1 2 3 4 - - (7) - 9 10 11
            if (dashboard.getMonth() < month) {
                closestMonthInCurrentYear = dashboard.getMonth();
            } else {
                System.out.println("Found closest month: " + closestMonthInCurrentYear);
                break;
            }
        }

        System.out.println("Getting the last closest dashboard complete. Result is month: " +
                closestMonthInCurrentYear + ", year: " + year);
        List<Dashboard> byYearAndMonth = dashboardRepo.findByYearAndMonthAndUserId(year, closestMonthInCurrentYear,
                userId);

        System.out.println("[DashboardService] Getting the last closest dashboard: " + byYearAndMonth);
        return byYearAndMonth.get(0);
    }

}
