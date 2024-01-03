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
import com.budgeta.sdk.api.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.ConstraintViolationException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepo;

    @Override
    public List<Expense> getByDashboardId(String dashboardId) throws ConstraintViolationException, ValidationCollectionException {
        List<Expense> expenses = expenseRepo.findByDashboardId(dashboardId);
        if(expenses.isEmpty()){
            throw new ValidationCollectionException("No expenses found for the given dashboardId: " + dashboardId);
        }
        return expenses;
    }

    @Override
    public void createExpense(Expense expense) throws ConstraintViolationException, ValidationCollectionException {

        if(expense.isLoan() && (expense.getMaxPeriod() <= 1 || expense.getStartDate() == null)) {
            throw new ValidationCollectionException("Loan type cannot have less then 1 month period for funds returns.");
        }

        if(expense.isScheduled() && (expense.getScheduledPeriod().length <= 1) ) {
            throw new ValidationCollectionException("Scheduled type cannot have less then 1 month period for funds partial payments.");
        }

        Optional<Expense> expenseOptional = expenseRepo.findByName(expense.getName());
        if (expenseOptional.isPresent() && expense.getDashboardId().equals(expenseOptional.get().getDashboardId())) {
            throw new ValidationCollectionException(ValidationCollectionException.alreadyExists());
        }
        expense.setUpdatedAt(new Date());
        expenseRepo.save(expense);
    }

    @Override
    public void updateExpense(Expense expense) throws ConstraintViolationException, ValidationCollectionException {
        Optional<Expense> expenseOptional = expenseRepo.findById(expense.getId());
        if (expenseOptional.isPresent()) {
            expense.setUpdatedAt(new Date());
            expenseRepo.save(expense);
        } else {
            throw new ValidationCollectionException(ValidationCollectionException.notFound(expense.getId()));
        }
    }
}
