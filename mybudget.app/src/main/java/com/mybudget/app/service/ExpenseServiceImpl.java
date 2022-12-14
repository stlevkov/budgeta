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
import com.mybudget.app.model.Expense;
import com.mybudget.app.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.ConstraintViolationException;
import java.util.Date;
import java.util.Optional;

@Service
public class ExpenseServiceImpl implements ExpenseService{

    @Autowired
    private ExpenseRepository expenseRepo;

    @Override
    public void createExpense(Expense expense) throws ConstraintViolationException, ValidationCollectionException {
        System.out.println("Trying to create new Expense: " + expense);
        Optional<Expense> expenseOptional = expenseRepo.findByName(expense.getName());
        System.out.println("Is the expense already present? " + expenseOptional.isPresent());
        if(expenseOptional.isPresent()){
            throw new ValidationCollectionException(ValidationCollectionException.alreadyExists());
        }
        System.out.println("Creating Expense from the service");
        expense.setUpdatedAt(new Date());
        expenseRepo.save(expense);
    }
}
