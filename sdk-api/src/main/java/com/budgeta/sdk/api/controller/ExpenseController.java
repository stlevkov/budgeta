/*
    Budgeta Application
    Copyright (C) 2022  S.Levkov, K.Ivanov

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
import com.budgeta.sdk.api.model.Expense;
import com.budgeta.sdk.api.repository.ExpenseRepository;
import com.budgeta.sdk.api.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.ConstraintViolationException;
import java.util.Date;
import java.util.List;
import java.util.Optional;


@RestController
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;
    @Autowired
    private ExpenseService expenseService;

    @GetMapping("/api/expenses")
    public ResponseEntity<?> getAll() {
        System.out.println("Get All Expenses called");
        List<Expense> expenses = expenseRepository.findAll();
        if (!expenses.isEmpty()) {
            return new ResponseEntity<>(expenses, HttpStatus.OK);
        }
        return new ResponseEntity<>("No Expenses available", HttpStatus.NO_CONTENT);
    }

    @GetMapping("/api/expenses/{dashboardId}") // Update the request mapping
    public ResponseEntity<?> getAllByDashboardId(@PathVariable String dashboardId) {
        System.out.println("[GET][EXPENSES] getAllByDashboardId called for dashboardId: " + dashboardId);
        List<Expense> expenses = expenseRepository.findByDashboardId(dashboardId); // Update the repository method
        if (!expenses.isEmpty()) {
            return new ResponseEntity<>(expenses, HttpStatus.OK);
        }
        return new ResponseEntity<>("No Expenses available for the specified dashboardId.", HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/api/expenses/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable("id") String id){
        System.out.println("Delete Expense");
        Optional<Expense> expenses = expenseRepository.findById(id);
        if(expenses.isPresent()) {
            expenseRepository.delete(expenses.get());
            return new ResponseEntity<>("Expense with id: " + id + " has been deleted.", HttpStatus.OK);
        }
        return new ResponseEntity<>("Expense with id " + id + " is not found.", HttpStatus.NOT_FOUND);
    }

    @PostMapping("/api/expenses")
    public ResponseEntity<?> createExpense(@RequestBody Expense expense){
        try{
            expenseService.createExpense(expense);
            return new ResponseEntity<>(expense, HttpStatus.CREATED);
        } catch (ConstraintViolationException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNPROCESSABLE_ENTITY);
        } catch (ValidationCollectionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @PutMapping("/api/expenses/{id}")
    public ResponseEntity<?> updateExpense(@PathVariable String id, @RequestBody Expense expense){
        System.out.println("Updating Expense");
        Optional<Expense> expenseOptional = expenseRepository.findById(id);
        if(expenseOptional.isPresent()){
            Expense expenseUpdate = expenseOptional.get();
            expenseUpdate.setName(expense.getName());
            expenseUpdate.setUpdatedAt(new Date());
            expenseUpdate.setDescription(expense.getDescription());
            expenseUpdate.setValue(expense.getValue());
            try{
                expenseRepository.save(expenseUpdate);
                return new ResponseEntity<>(expenseUpdate, HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>("Unable to create expense. Reason: " + e.getMessage(),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>("Unable to update expense with id " + id +
                ". Reason: Expense with this ID not found.", HttpStatus.NOT_FOUND);
    }
}
