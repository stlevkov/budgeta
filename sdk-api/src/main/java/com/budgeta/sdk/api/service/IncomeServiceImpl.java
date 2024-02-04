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
import com.budgeta.sdk.api.model.Expense;
import com.budgeta.sdk.api.model.Income;
import com.budgeta.sdk.api.repository.IncomeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.ConstraintViolationException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class IncomeServiceImpl implements IncomeService{

    @Autowired
    private IncomeRepository incomeRepo;

    @Override
    public void createIncome(Income income) throws ConstraintViolationException, ValidationCollectionException {
        Optional<Income> incomeOptional = incomeRepo.findByNameAndDashboardId(income.getName(), income.getDashboardId());
        if(incomeOptional.isPresent()){
            throw new ValidationCollectionException(ValidationCollectionException.alreadyExists());
        }
        income.setUpdatedAt(new Date());
        incomeRepo.save(income);
    }

    @Override
    public void updateIncome(Income income) throws ConstraintViolationException, ValidationCollectionException {
        Optional<Income> incomeOptional = incomeRepo.findById(income.getId());
        if (incomeOptional.isPresent()) {
            income.setUpdatedAt(new Date());
            incomeRepo.save(income);
        } else {
            throw new ValidationCollectionException(ValidationCollectionException.notFound(income.getId()));
        }
    }

    @Override
    public List<Income> getByDashboardId(String dashboardId) throws ConstraintViolationException, ValidationCollectionException {
        List<Income> incomes = incomeRepo.findByDashboardId(dashboardId);
        if(incomes.isEmpty()){
            throw new ValidationCollectionException("No incomes found for the given dashboardId: " + dashboardId);
        }
        return incomes;
    }
}
