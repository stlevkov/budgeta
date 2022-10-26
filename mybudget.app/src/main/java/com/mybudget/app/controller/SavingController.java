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
package com.mybudget.app.controller;

import com.mybudget.app.exception.ValidationCollectionException;
import com.mybudget.app.model.Saving;
import com.mybudget.app.repository.SavingRepository;
import com.mybudget.app.service.SavingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.ConstraintViolationException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
public class SavingController {
    @Autowired
    private SavingRepository savingRepository;

    @Autowired
    private SavingService savingService;

    @GetMapping("/api/savings")
    public ResponseEntity<?> getAll(){
        System.out.println("GetAllSavings called");
        List<Saving> savings = savingRepository.findAll();
        if(savings.size() > 0) {
            return new ResponseEntity<List<Saving>>(savings, HttpStatus.OK);
        }
        return new ResponseEntity<>("No Savings available", HttpStatus.NOT_FOUND);
    }

    @GetMapping("/api/savings/{id}")
    public ResponseEntity<?> getSaving(@PathVariable("id") String id){
        System.out.println("Get single Saving");
        Optional<Saving> saving = savingRepository.findById(id);
        if(saving.isPresent()) {
            return new ResponseEntity<Saving>(saving.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>("Saving with id " + id + " is not found.", HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/api/savings/{id}")
    public ResponseEntity<?> deleteSaving(@PathVariable("id") String id){
        System.out.println("Delete Saving");
        Optional<Saving> saving = savingRepository.findById(id);
        if(saving.isPresent()) {
            savingRepository.delete(saving.get());
            return new ResponseEntity<>("Saving with id: " + id + " has been deleted.", HttpStatus.OK);
        }
        return new ResponseEntity<>("Saving with id " + id + " is not found.", HttpStatus.NOT_FOUND);
    }

    @PostMapping("/api/savings")
    public ResponseEntity<?> createSaving(@RequestBody Saving saving){
        try{
            savingService.createSaving(saving);
            return new ResponseEntity<>(saving, HttpStatus.CREATED);
        } catch (ConstraintViolationException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNPROCESSABLE_ENTITY);
        } catch (ValidationCollectionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }


    @PutMapping("/api/savings/{id}")
    public ResponseEntity<?> updateSaving(@PathVariable String id, @RequestBody Saving saving){
        System.out.println("Updating Saving");
        Optional<Saving> savingOptional = savingRepository.findById(id);
        if(savingOptional.isPresent()){
            Saving savingUpdate = savingOptional.get();
            savingUpdate.setName(saving.getName());
            savingUpdate.setUpdatedAt(new Date());
            savingUpdate.setDescription(saving.getDescription());
            savingUpdate.setValue(saving.getValue());
            try{
                savingRepository.save(savingUpdate);
                return new ResponseEntity<>(savingUpdate, HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>("Unable to create saving. Reason: " + e.getMessage(),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>("Unable to update saving with id " + id +
                ". Reason: Saving with this ID not found.", HttpStatus.NOT_FOUND);
    }

}
