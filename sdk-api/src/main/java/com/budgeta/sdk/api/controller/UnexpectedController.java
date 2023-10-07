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
import com.budgeta.sdk.api.model.Unexpected;
import com.budgeta.sdk.api.repository.UnexpectedRepository;
import com.budgeta.sdk.api.service.UnexpectedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.ConstraintViolationException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
public class UnexpectedController {
    @Autowired
    private UnexpectedRepository unexpectedRepository;

    @Autowired
    private UnexpectedService unexpectedService;

    @GetMapping("/api/unexpecteds")
    public ResponseEntity<?> getAll() {
        System.out.println("Get All Unexpected called");
        List<Unexpected> unexpectedItems = unexpectedRepository.findAll();
        if (!unexpectedItems.isEmpty()) {
            return new ResponseEntity<>(unexpectedItems, HttpStatus.OK);
        }
        return new ResponseEntity<>("No Unexpected items available", HttpStatus.NO_CONTENT);
    }

    @GetMapping("/api/unexpecteds/{dashboardId}")
    public ResponseEntity<?> getAllByDashboardId(@PathVariable String dashboardId) {
        System.out.println("[GET][UNEXPECTED] getAllByDashboardId called for dashboardId: " + dashboardId);
        List<Unexpected> unexpectedItems = unexpectedRepository.findByDashboardId(dashboardId);
        if (!unexpectedItems.isEmpty()) {
            return new ResponseEntity<>(unexpectedItems, HttpStatus.OK);
        }
        return new ResponseEntity<>("No Unexpected items available for the specified dashboardId.", HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/api/unexpecteds/{id}")
    public ResponseEntity<?> deleteUnexpected(@PathVariable("id") String id){
        System.out.println("Delete Unexpected");
        Optional<Unexpected> unexpected = unexpectedRepository.findById(id);
        if(unexpected.isPresent()) {
            unexpectedRepository.delete(unexpected.get());
            return new ResponseEntity<>("Unexpected with id: " + id + " has been deleted.", HttpStatus.OK);
        }
        return new ResponseEntity<>("Unexpected with id " + id + " is not found.", HttpStatus.NOT_FOUND);
    }

    @PostMapping("/api/unexpecteds")
    public ResponseEntity<?> createUnexpected(@RequestBody Unexpected unexpected){
        try{
            unexpectedService.createUnexpected(unexpected);
            return new ResponseEntity<>(unexpected, HttpStatus.CREATED);
        } catch (ConstraintViolationException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNPROCESSABLE_ENTITY);
        } catch (ValidationCollectionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }


    @PutMapping("/api/unexpecteds/{id}")
    public ResponseEntity<?> updateUnexpected(@PathVariable String id, @RequestBody Unexpected unexpected){
        System.out.println("Updating Unexpected");
        Optional<Unexpected> unexpectedOptional = unexpectedRepository.findById(id);
        if(unexpectedOptional.isPresent()){
            Unexpected unexpectedUpdate = unexpectedOptional.get();
            unexpectedUpdate.setName(unexpected.getName());
            unexpectedUpdate.setUpdatedAt(new Date());
            unexpectedUpdate.setDescription(unexpected.getDescription());
            unexpectedUpdate.setValue(unexpected.getValue());
            try{
                unexpectedRepository.save(unexpectedUpdate);
                return new ResponseEntity<>(unexpectedUpdate, HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>("Unable to create unexpected. Reason: " + e.getMessage(),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>("Unable to update unexpected with id " + id +
                ". Reason: Unexpected with this ID not found.", HttpStatus.NOT_FOUND);
    }

}
