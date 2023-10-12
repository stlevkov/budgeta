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
import com.budgeta.sdk.api.repository.CostAnalyticRepository;
import com.budgeta.sdk.api.repository.ExpenseRepository;
import com.budgeta.sdk.api.repository.IncomeRepository;
import com.budgeta.sdk.api.repository.UnexpectedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.ConstraintViolationException;
import java.math.BigDecimal;
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

    @Override
    public void createCostAnalytic(CostAnalytic costAnalytic) throws ConstraintViolationException, ValidationCollectionException {
        System.out.println("Trying to create initial CostAnalytic: " + costAnalytic);
        List<CostAnalytic> costAnalytics = costAnalyticRepo.findAll();
        System.out.println("Is the CostAnalytic already present? " + (costAnalytics.size() == 1));
        if(!costAnalytics.isEmpty()){
            throw new ValidationCollectionException("Creation of more CostAnalytic entries is not allowed");
        }
        System.out.println("Creating CostAnalytic from the service");
        costAnalytic.setAllExpenses(BigDecimal.ZERO);
        costAnalytic.setDailyRecommended(BigDecimal.ZERO);
        costAnalytic.setMonthlyTarget(BigDecimal.ZERO);
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

}
