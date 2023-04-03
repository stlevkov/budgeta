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
package com.mybudget.app.service;

import com.mybudget.app.exception.ValidationCollectionException;
import com.mybudget.app.model.BalanceTransaction;
import com.mybudget.app.model.CostAnalytic;
import com.mybudget.app.repository.CostAnalyticRepository;
import com.mybudget.app.repository.ExpenseRepository;
import com.mybudget.app.repository.IncomeRepository;
import com.mybudget.app.repository.SavingRepository;
import com.mybudget.app.utils.ArithmeticUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.ConstraintViolationException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Calendar;
import java.util.List;

@Service
public class CostAnalyticServiceImpl implements CostAnalyticService {

    @Autowired
    private CostAnalyticRepository costAnalyticRepository;

    @Autowired
    private ExpenseRepository expenseRepository;
    @Autowired
    private IncomeRepository incomeRepository;
    @Autowired
    private SavingRepository savingRepository;

    @Override
    public void createCostAnalytic(CostAnalytic costAnalytic) throws ConstraintViolationException, ValidationCollectionException {
        System.out.println("Trying to create initial CostAnalytic: " + costAnalytic);
        List<CostAnalytic> costAnalytics = costAnalyticRepository.findAll();
        System.out.println("Is the CostAnalytic already present? " + (costAnalytics.size() == 1));
        if(costAnalytics.size() >= 1){
            throw new ValidationCollectionException("Creation of more CostAnalytic entries is not allowed");
        }
        System.out.println("Creating CostAnalytic from the service");
        costAnalytic.setAllExpenses(BigDecimal.ZERO);
        costAnalytic.setDailyRecommended(BigDecimal.ZERO);
        costAnalytic.setMonthlyTarget(BigDecimal.ZERO);
        costAnalyticRepository.save(costAnalytic);
    }

    @Override
    public CostAnalytic updateCostAnalytic(CostAnalytic costAnalytic) throws ConstraintViolationException, ValidationCollectionException {
        System.out.println("Trying to update initial CostAnalytic: " + costAnalytic);
        // At this point Unexpected and TargetSaving are already set in the object by the caller
        List<CostAnalytic> costAnalytics = costAnalyticRepository.findAll();
        System.out.println("Is the CostAnalytic already present? " + (costAnalytics.size() == 1));

        if(costAnalytics.size() < 1){
            throw new ValidationCollectionException("CostAnalytic not found. You should create it first.");
        }

        System.out.println("Updating CostAnalytic from the service");
        BigDecimal sumExpenses = ArithmeticUtils.sumExpenses(expenseRepository.findAll());
        BigDecimal sumIncomes = ArithmeticUtils.sumIncomes(incomeRepository.findAll());
        BigDecimal sumSavings = ArithmeticUtils.sumSavings(savingRepository.findAll());
        BigDecimal targetSaving = costAnalytic.getTargetSaving();

        BigDecimal monthlyTarget = calculateMonthlyTarget(sumExpenses, sumIncomes, sumSavings, targetSaving);
        BigDecimal dailyRecommended = calculateDailyRecommended(targetSaving, sumExpenses, sumIncomes, sumSavings);

        costAnalytic.setAllExpenses(sumExpenses.add(sumSavings));
        costAnalytic.setDailyRecommended(dailyRecommended);
        costAnalytic.setMonthlyTarget(monthlyTarget);
        return costAnalyticRepository.save(costAnalytic);
    }

    @Override
    public void updateCostAnalytic(BalanceTransaction transaction) throws ValidationCollectionException {
        List<CostAnalytic> costAnalytics = costAnalyticRepository.findAll();
        System.out.println("Is the CostAnalytic already present? " + (costAnalytics.size() == 1));

        if(costAnalytics.size() < 1){
            throw new ValidationCollectionException("CostAnalytic not found. You should create it first.");
        }

        CostAnalytic costAnalytic = costAnalytics.get(0);

        if(transaction.getType().equals(BalanceTransaction.BalanceTransactionType.WITHDRAW)){
            costAnalytic.setBalanceAccount(costAnalytic.getBalanceAccount().subtract(transaction.getValue()));
        } else { // deposit
            costAnalytic.setBalanceAccount(costAnalytic.getBalanceAccount().add(transaction.getValue()));
        }
        costAnalyticRepository.save(costAnalytic);
    }

    private BigDecimal calculateMonthlyTarget(BigDecimal sumExpenses, BigDecimal sumIncomes, BigDecimal sumSavings, BigDecimal targetSaving) {
        // Incomes - (Expenses + Savings + TargetSave + Unexpected)
        return sumIncomes.subtract(sumExpenses.add(sumSavings).add(targetSaving)).setScale(2, RoundingMode.HALF_EVEN);
    }

    private BigDecimal calculateDailyRecommended(BigDecimal targetSavings, BigDecimal sumExpenses, BigDecimal sumIncomes, BigDecimal sumSavings){
        // (Incomes - (Expenses + Savings + TargetSave + Unexpected)) / days in month
        BigDecimal overall = sumIncomes.subtract(targetSavings.add(sumExpenses).add(sumSavings));
        return overall.divide(BigDecimal.valueOf(Calendar.getInstance().getActualMaximum(Calendar.DAY_OF_MONTH)),
                2, RoundingMode.HALF_EVEN);
    }


}
