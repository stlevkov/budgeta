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
import com.budgeta.sdk.api.model.BalanceTransaction;
import com.budgeta.sdk.api.repository.BalanceRepository;
import com.budgeta.sdk.api.service.BalanceService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.ConstraintViolationException;
import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
public class BalanceController {

    private BalanceRepository balanceRepository;

    private BalanceService unexpectedService;

    @GetMapping("/api/balanceAccount")
    public ResponseEntity<?> GetBalanceAccount(){
        System.out.println("GetBalanceAccount called");
        List<BalanceTransaction> balanceTransactions = balanceRepository.findAll();
        if(balanceTransactions.size() > 0) {
            return new ResponseEntity<>(balanceTransactions, HttpStatus.OK);
        }
        return new ResponseEntity<>("No BalanceTransactions available", HttpStatus.NO_CONTENT);
    }

    @GetMapping("/api/balanceAccount/{id}")
    public ResponseEntity<?> getBalanceTransaction(@PathVariable("id") String id){
        System.out.println("Get single Balance Account Transaction");
        Optional<BalanceTransaction> balanceTransaction = balanceRepository.findById(id);
        if(balanceTransaction.isPresent()) {
            return new ResponseEntity<>(balanceTransaction.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>("Balance Transaction with id " + id + " is not found.", HttpStatus.NOT_FOUND);
    }

    @PostMapping("/api/balanceAccount")
    public ResponseEntity<?> createBalanceTransaction(@RequestBody BalanceTransaction balanceTransaction){
        try{
            unexpectedService.createBalanceTransaction(balanceTransaction);
            return new ResponseEntity<>(balanceTransaction, HttpStatus.CREATED);
        } catch (ConstraintViolationException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNPROCESSABLE_ENTITY);
        } catch (ValidationCollectionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }
}
