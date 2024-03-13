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
package com.budgeta.sdk.api.controller;

import com.budgeta.sdk.api.exception.ValidationCollectionException;
import com.budgeta.sdk.api.model.BalanceAccount;
import com.budgeta.sdk.api.model.BalanceAccountTransaction;
import com.budgeta.sdk.api.repository.BalanceAccountTransactionRepository;
import com.budgeta.sdk.api.service.BalanceAccountService;
import com.budgeta.sdk.api.service.BalanceAccountTransactionService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.ConstraintViolationException;
import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
public class BalanceAccountTransactionController {

    private BalanceAccountTransactionRepository balanceAccountTransactionRepository;

    private BalanceAccountTransactionService balanceAccountTransactionService;

    private BalanceAccountService balanceAccountService;

    @GetMapping("/api/balanceAccount/transaction/delete_all")
    @PreAuthorize("hasRole('ADMIN'")
    public ResponseEntity<?> deleteAll(){
         balanceAccountTransactionRepository.deleteAll();
        return new ResponseEntity<>("All transactions deleted", HttpStatus.OK);
    }

    @GetMapping("/api/balanceAccount/transaction")
    public ResponseEntity<?> getBalanceAccountTransactions(){
        System.out.println("[GET] [BalanceAccountTransaction] GetBalanceAccount transactions called");
        List<BalanceAccountTransaction> balanceAccountTransactions = balanceAccountTransactionRepository.findAll();
        if(!balanceAccountTransactions.isEmpty()) {
            return new ResponseEntity<>(balanceAccountTransactions, HttpStatus.OK);
        }
        return new ResponseEntity<>("No BalanceTransactions available", HttpStatus.NO_CONTENT);
    }

    @GetMapping("/api/balanceAccount/transaction/{id}")
    public ResponseEntity<?> getBalanceAccountTransaction(@PathVariable("id") String id){
        System.out.println("[GET][BalanceAccountTransaction] Get single Balance Account Transaction");
        Optional<BalanceAccountTransaction> balanceTransaction = balanceAccountTransactionRepository.findById(id);
        if(balanceTransaction.isPresent()) {
            return new ResponseEntity<>(balanceTransaction.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>("Balance Transaction with id " + id + " is not found.", HttpStatus.NOT_FOUND);
    }

    @PostMapping("/api/balanceAccount/transaction/{id}")
    public ResponseEntity<?> createBalanceAccountTransaction(@PathVariable("id") String accountId, @RequestBody BalanceAccountTransaction balanceAccountTransaction){
        System.out.println("[POST][BalanceAccountTransaction] Create new Balance transaction: " + balanceAccountTransaction);
        Optional<BalanceAccount> balanceAccount = balanceAccountService.getBalanceAccount(accountId);
         if(balanceAccount.isEmpty()) {
             return new ResponseEntity<>("Balance Account with id " + accountId + " is not found.",
                     HttpStatus.NOT_FOUND);
         }

        try{
            balanceAccountTransaction.setBalanceAccount(balanceAccount.get());
            balanceAccountTransactionService.createBalanceTransaction(balanceAccountTransaction);
            return new ResponseEntity<>(balanceAccountTransaction, HttpStatus.CREATED);
        } catch (ConstraintViolationException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNPROCESSABLE_ENTITY);
        } catch (ValidationCollectionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }
}
