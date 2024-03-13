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
import com.budgeta.sdk.api.model.BalanceAccount;
import com.budgeta.sdk.api.model.BalanceAccountTransaction;
import com.budgeta.sdk.api.repository.BalanceAccountTransactionRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.validation.ConstraintViolationException;
import java.util.Date;

@Service
@AllArgsConstructor
public class BalanceAccountTransactionServiceImpl implements BalanceAccountTransactionService {

    BalanceAccountTransactionRepository balanceAccountTransactionRepository;

    BalanceAccountService balanceAccountService;

    @Override
    public void createBalanceTransaction(BalanceAccountTransaction balanceAccountTransaction) throws ConstraintViolationException, ValidationCollectionException {
        balanceAccountTransaction.setUpdatedAt(new Date());
        balanceAccountTransactionRepository.save(balanceAccountTransaction);
        BalanceAccount account = balanceAccountTransaction.getBalanceAccount();
        account.setValue(balanceAccountTransaction.getType().equals(BalanceAccountTransaction.DEPOSIT) ?
                account.getValue().add(balanceAccountTransaction.getValue()) :
                account.getValue().subtract(balanceAccountTransaction.getValue()));
        balanceAccountService.updateBalanceAccount(balanceAccountTransaction.getBalanceAccount());
    }
}
