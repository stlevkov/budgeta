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
import com.budgeta.sdk.api.model.Income;
import com.budgeta.sdk.api.repository.IncomeRepository;
import com.budgeta.sdk.api.service.IncomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.ConstraintViolationException;
import java.util.Date;
import java.util.List;
import java.util.Optional;


@RestController
public class IncomeController {

    @Autowired
    private IncomeRepository incomeRepository;
    @Autowired
    private IncomeService incomeService;

    @GetMapping("/api/incomes")
    public ResponseEntity<?> getAll(){
        System.out.println("GetAllIncomes called");
        List<Income> incomes = incomeRepository.findAll();
        if(!incomes.isEmpty()) {
            return new ResponseEntity<>(incomes, HttpStatus.OK);
        }
        return new ResponseEntity<>("No Incomes available", HttpStatus.NO_CONTENT);
    }

    @GetMapping("/api/incomes/{dashboardId}")
    public ResponseEntity<?> getAllByDashboardId(@PathVariable String dashboardId){
        System.out.println("[GET][INCOMES] getAllByDashboardId called for dashboardId: " + dashboardId);
        List<Income> incomes = incomeRepository.findByDashboardId(dashboardId);
        if(!incomes.isEmpty()) {
            return new ResponseEntity<>(incomes, HttpStatus.OK);
        }
        return new ResponseEntity<>("No Incomes available for the specified dashboardId.", HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/api/incomes/{id}")
    public ResponseEntity<?> deleteIncome(@PathVariable("id") String id){
        System.out.println("Delete Income");
        Optional<Income> incomes = incomeRepository.findById(id);
        if(incomes.isPresent()) {
            incomeRepository.delete(incomes.get());
            return new ResponseEntity<>("Income with id: " + id + " has been deleted.", HttpStatus.OK);
        }
        return new ResponseEntity<>("Income with id " + id + " is not found.", HttpStatus.NOT_FOUND);
    }

    @PostMapping("/api/incomes")
    public ResponseEntity<?> createIncome(@RequestBody Income income){
        try{
            incomeService.createIncome(income);
            return new ResponseEntity<>(income, HttpStatus.CREATED);
        } catch (ConstraintViolationException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNPROCESSABLE_ENTITY);
        } catch (ValidationCollectionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @PutMapping("/api/incomes/{id}")
    public ResponseEntity<?> updateIncome(@PathVariable String id, @RequestBody Income income){
        System.out.println("Updating Income");
        Optional<Income> incomeOptional = incomeRepository.findById(id);
        if(incomeOptional.isPresent()){
            Income incomeUpdate = incomeOptional.get();
            incomeUpdate.setName(income.getName());
            incomeUpdate.setUpdatedAt(new Date());
            incomeUpdate.setDescription(income.getDescription());
            incomeUpdate.setValue(income.getValue());
            try{
                incomeRepository.save(incomeUpdate);
                return new ResponseEntity<>(incomeUpdate, HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>("Unable to create income. Reason: " + e.getMessage(),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>("Unable to update income with id " + id +
                ". Reason: Income with this ID not found.", HttpStatus.NOT_FOUND);
    }
}
