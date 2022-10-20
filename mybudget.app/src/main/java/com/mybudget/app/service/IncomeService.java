package com.mybudget.app.service;

import com.mybudget.app.exception.TodoCollectionException;
import com.mybudget.app.model.Income;

import javax.validation.ConstraintViolationException;

public interface IncomeService {

    void createIncome(Income income) throws ConstraintViolationException, TodoCollectionException;
}
