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
        System.out.println("[GET][UNEXPECTED] Get All Unexpected called");
        return new ResponseEntity<>(unexpectedRepository.findAll(), HttpStatus.OK);
    }

    @GetMapping("/api/unexpecteds/{dashboardId}")
    public ResponseEntity<?> getAllByDashboardId(@PathVariable String dashboardId) {
        System.out.println("[GET][UNEXPECTED] getAllByDashboardId called for dashboardId: " + dashboardId);
        return new ResponseEntity<>(unexpectedRepository.findByDashboardId(dashboardId), HttpStatus.OK);
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
        System.out.println("[POST][UNEXPECTED] Creating Unexpected: " + unexpected);
        try{
            unexpectedService.createUnexpected(unexpected);
            return new ResponseEntity<>(unexpected, HttpStatus.CREATED);
        } catch (ConstraintViolationException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNPROCESSABLE_ENTITY);
        } catch (ValidationCollectionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @PutMapping("/api/unexpecteds")
    public ResponseEntity<?> updateUnexpected(@RequestBody Unexpected unexpected){
        try {
            System.out.println("[PUT][UNEXPECTED] Updating Unexpected: " + unexpected);
            unexpectedService.updateUnexpected(unexpected);
            return new ResponseEntity<>(unexpected, HttpStatus.ACCEPTED);
        } catch (ConstraintViolationException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNPROCESSABLE_ENTITY);
        } catch (ValidationCollectionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

}
