/*
    Budgeta Application
    Copyright (C) 2023  S.Levkov, K.Ivanov

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
 */
package com.budgeta.sdk.api.repository;

import com.budgeta.sdk.api.model.BalanceAccount;
import com.budgeta.sdk.api.model.BalanceAccountTransaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BalanceAccountRepository extends MongoRepository<BalanceAccount, String> {

    List<BalanceAccount> findByUserId(String userId);
}
