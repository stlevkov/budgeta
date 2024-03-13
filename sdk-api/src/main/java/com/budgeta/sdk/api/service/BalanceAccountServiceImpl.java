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

import com.budgeta.sdk.api.model.BalanceAccount;
import com.budgeta.sdk.api.repository.BalanceAccountRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.ConstraintViolationException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class BalanceAccountServiceImpl implements BalanceAccountService {

    private BalanceAccountRepository balanceAccountRepository;

    @Autowired
    UserService userService;

    @Override
    public List<BalanceAccount> getBalanceAccounts() {
        return balanceAccountRepository.findByUserId(userService.getCurrentLoggedUser().getId());
    }

    @Override
    public void createBalanceAccount(BalanceAccount balanceAccount) throws ConstraintViolationException {
        balanceAccount.setUser(userService.getCurrentLoggedUser());
        balanceAccount.setUpdatedAt(new Date());
        // check if primary account is already set, replace with the current if any
        if(Boolean.TRUE.equals(balanceAccount.getPrimary())) {
            getPrimaryBalanceAccount().ifPresent(primaryAccount -> {
               primaryAccount.setPrimary(false);
               balanceAccountRepository.save(primaryAccount);
                System.out.println("[BalanceAccountService] Primary account already set, replacing with the current one.");
            });
        }
        // By default, the first account created is set as primary even if not set by the user
        if(Boolean.FALSE.equals(balanceAccount.getPrimary()) && getPrimaryBalanceAccount().isEmpty()){
            balanceAccount.setPrimary(true);
        }
        balanceAccountRepository.save(balanceAccount);
    }

    @Override
    public Optional<BalanceAccount> getPrimaryBalanceAccount() {
        return balanceAccountRepository.findByUserId(userService.getCurrentLoggedUser().getId()).stream()
                .filter(BalanceAccount::getPrimary).findFirst();
    }

    @Override
    public Optional<BalanceAccount> getBalanceAccount(String accountId) {
        return balanceAccountRepository.findById(accountId);
    }

    @Override
    public void updateBalanceAccount(BalanceAccount balanceAccount) {
        balanceAccount.setUpdatedAt(new Date());
        balanceAccountRepository.save(balanceAccount);
    }
}
