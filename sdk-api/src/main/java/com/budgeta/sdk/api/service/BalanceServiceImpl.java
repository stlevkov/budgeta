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
import com.budgeta.sdk.api.repository.BalanceRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.validation.ConstraintViolationException;
import java.util.Date;

@Service
@AllArgsConstructor
public class BalanceServiceImpl implements BalanceService {

    private BalanceRepository balanceRepository;

    @Override
    public void createBalanceTransaction(BalanceTransaction balanceTransaction) throws ConstraintViolationException, ValidationCollectionException {
        balanceTransaction.setUpdatedAt(new Date());
        balanceRepository.save(balanceTransaction);
    }
}
