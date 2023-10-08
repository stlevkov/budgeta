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
import com.budgeta.sdk.api.model.CostAnalytic;
import com.budgeta.sdk.api.repository.CostAnalyticRepository;
import com.budgeta.sdk.api.service.CostAnalyticService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.ConstraintViolationException;
import java.math.BigDecimal;
import java.util.List;

@RestController
public class CostAnalyticController {
    @Autowired
    private CostAnalyticRepository costAnalyticRepository;

    @Autowired
    private CostAnalyticService costAnalyticService;

    @GetMapping("/api/costAnalytics")
    public ResponseEntity<?> getAll(){
        System.out.println("[GET][CostAnalytic] getAll called");
        List<CostAnalytic> costAnalytics = costAnalyticRepository.findAll();
        if(!costAnalytics.isEmpty()) {
            return new ResponseEntity<>(costAnalytics.get(0), HttpStatus.OK);
        }
        return new ResponseEntity<>("No CostAnalytics available", HttpStatus.NO_CONTENT);
    }

    @PutMapping("/api/costAnalytics")
    public ResponseEntity<?> updateCostAnalytic(@RequestBody CostAnalytic costAnalytic){
        System.out.println("[PUT][CostAnalytic] Updating CostAnalytic: " + costAnalytic);
        try {
            costAnalyticService.updateCostAnalytic(costAnalytic);
            return new ResponseEntity<>(costAnalytic, HttpStatus.ACCEPTED);
        } catch (ConstraintViolationException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNPROCESSABLE_ENTITY);
        } catch (ValidationCollectionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/api/costAnalytics/targetSaving") // TODO Remove this and use the generic update
    public ResponseEntity<?> updateCostAnalytic(@RequestBody BigDecimal targetSaving){
        System.out.println("Updating CostAnalytic - targetSaving");
        List<CostAnalytic> costAnalytics = costAnalyticRepository.findAll();
        // TODO - Removed create snipped! Handle the creation of the initial CostAnalytic differently!
        // TODO - Just create regular create api path!
        // updating
        CostAnalytic costAnalytic = costAnalytics.get(0);
        if(costAnalytic != null) {
            costAnalytic.setTargetSaving(targetSaving);
            costAnalyticRepository.save(costAnalytic);
            System.out.println("Updated.");
            return new ResponseEntity<>(costAnalytic, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Unable to update CostAnalytic . " +
                    "Reason: CostAnalytic not found or not created yet.", HttpStatus.NOT_FOUND);
        }
    }
}
