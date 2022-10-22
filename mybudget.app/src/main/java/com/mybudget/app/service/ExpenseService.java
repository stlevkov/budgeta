package com.mybudget.app.service;

import com.mybudget.app.exception.TodoCollectionException;
import com.mybudget.app.model.Expense;

import javax.validation.ConstraintViolationException;

public interface ExpenseService {

    void createExpense(Expense expense) throws ConstraintViolationException, TodoCollectionException;
}
