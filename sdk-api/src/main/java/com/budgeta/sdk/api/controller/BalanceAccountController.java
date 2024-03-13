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
import com.budgeta.sdk.api.repository.BalanceAccountRepository;
import com.budgeta.sdk.api.service.BalanceAccountService;
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
public class BalanceAccountController {

    private BalanceAccountRepository balanceAccountRepository;

    private BalanceAccountService balanceAccountService;

    @GetMapping("/admin/api/balanceAccount/delete_all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAll(){
         balanceAccountRepository.deleteAll();
        return new ResponseEntity<>("All balance accounts deleted", HttpStatus.OK);
    }

    @GetMapping("/api/balanceAccount")
    public ResponseEntity<?> getBalanceAccounts(){
        System.out.println("[GET][BalanceAccount] GetBalanceAccounts called");
        List<BalanceAccount> balanceAccounts = balanceAccountRepository.findAll();
        if(!balanceAccounts.isEmpty()) {
            return new ResponseEntity<>(balanceAccounts, HttpStatus.OK);
        }
        return new ResponseEntity<>("No BalanceAccounts available", HttpStatus.NO_CONTENT);
    }

    @GetMapping("/api/balanceAccount/{id}")
    public ResponseEntity<?> getBalanceAccount(@PathVariable("id") String id){
        System.out.println("[GET][BalanceAccount] Get single Balance Account");
        Optional<BalanceAccount> balanceTransaction = balanceAccountRepository.findById(id);
        if(balanceTransaction.isPresent()) {
            return new ResponseEntity<>(balanceTransaction.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>("Balance Transaction with id " + id + " is not found.", HttpStatus.NOT_FOUND);
    }

    @PostMapping("/api/balanceAccount")
    public ResponseEntity<?> createBalanceTransaction(@RequestBody BalanceAccount balanceAccount){
        System.out.println("[POST][BalanceAccount] Create new Balance account: " + balanceAccount);
        try{
            balanceAccountService.createBalanceAccount(balanceAccount);
            return new ResponseEntity<>(balanceAccount, HttpStatus.CREATED);
        } catch (ConstraintViolationException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNPROCESSABLE_ENTITY);
        } catch (ValidationCollectionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }
}
