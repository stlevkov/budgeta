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
import com.mybudget.app.repository.BalanceRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.validation.ConstraintViolationException;
import java.util.Date;

@Service
@AllArgsConstructor
public class BalanceServiceImpl implements BalanceService {

    private BalanceRepository balanceRepository;
    private CostAnalyticService costAnalyticService;

    @Override
    public void createBalanceTransaction(BalanceTransaction balanceTransaction) throws ConstraintViolationException, ValidationCollectionException {
        System.out.println("Creating Balance Transaction from the service");
        //TODO update the CostAnalytic account Balance based on the balance Transaction type
        costAnalyticService.updateCostAnalytic(balanceTransaction);
        balanceTransaction.setUpdatedAt(new Date());
        balanceRepository.save(balanceTransaction);
    }
}
