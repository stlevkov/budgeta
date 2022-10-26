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
import com.mybudget.app.model.Income;
import com.mybudget.app.repository.IncomeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.ConstraintViolationException;
import java.util.Date;
import java.util.Optional;

@Service
public class IncomeServiceImpl implements IncomeService{

    @Autowired
    private IncomeRepository incomeRepo;

    @Override
    public void createIncome(Income income) throws ConstraintViolationException, ValidationCollectionException {
        System.out.println("Trying to create new Income: " + income);
        Optional<Income> incomeOptional = incomeRepo.findByName(income.getName());
        System.out.println("Is the income already present? " + incomeOptional.isPresent());
        if(incomeOptional.isPresent()){
            throw new ValidationCollectionException(ValidationCollectionException.alreadyExists());
        }
        System.out.println("Creating Income from the service");
        income.setUpdatedAt(new Date());
        incomeRepo.save(income);
    }
}
