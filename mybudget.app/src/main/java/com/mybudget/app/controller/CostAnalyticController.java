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
package com.mybudget.app.controller;

import com.mybudget.app.exception.ValidationCollectionException;
import com.mybudget.app.model.CostAnalytic;
import com.mybudget.app.repository.CostAnalyticRepository;
import com.mybudget.app.service.CostAnalyticService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        System.out.println("GetAll CostAnalytics called");
        List<CostAnalytic> costAnalytics = costAnalyticRepository.findAll();
        if(costAnalytics.size() > 0) {
            return new ResponseEntity<>(costAnalytics.get(0), HttpStatus.OK);
        }
        return new ResponseEntity<>("No CostAnalytics available", HttpStatus.NO_CONTENT);
    }

    @PutMapping("/api/costAnalytics/unexpected")
    public ResponseEntity<?> updateUnexpected(@RequestBody BigDecimal unexpected){
        System.out.println("Updating CostAnalytic - unexpected");
        List<CostAnalytic> costAnalytics = costAnalyticRepository.findAll();
        // TODO: 6.11.22 г. Move this to the Service and remove the code duplications
        if(costAnalytics.size() < 1){
            System.out.println("Unable to update the CostAnalytic, there is no one created yet. Creating...");
            // creating
            try {
                costAnalyticService.createCostAnalytic(new CostAnalytic(BigDecimal.ZERO, unexpected));
                System.out.println("Created.");
                return new ResponseEntity<>(unexpected, HttpStatus.OK);
            } catch (ValidationCollectionException e) {
                return new ResponseEntity<>("Unable to create CostAnalytic. Reason: " + e.getMessage(),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        // updating
        try {
            CostAnalytic costAnalytic = new CostAnalytic(
                    costAnalytics.get(0).getId(),
                    costAnalytics.get(0).getTargetSaving() == null ?
                            BigDecimal.ZERO : costAnalytics.get(0).getTargetSaving(),
                    unexpected);
            costAnalytic = costAnalyticService.updateCostAnalytic(costAnalytic);
            System.out.println("Updated.");
            return new ResponseEntity<>(costAnalytic, HttpStatus.OK);
        } catch (ValidationCollectionException e) {
            // TODO: 29.10.22 г. Remove this, its redundant
            return new ResponseEntity<>("CostAnalytic with id " + costAnalytics.get(0).getId() + " is not found.",
                    HttpStatus.NOT_FOUND);
        }

    }

    @PutMapping("/api/costAnalytics/targetSaving")
    public ResponseEntity<?> updateCostAnalytic(@RequestBody BigDecimal targetSaving){
        System.out.println("Updating CostAnalytic - targetSaving");
        List<CostAnalytic> costAnalytics = costAnalyticRepository.findAll();
        if(costAnalytics.size() < 1){
            System.out.println("Unable to update the CostAnalytic, there is no one created yet. Creating...");
            // creating
            try {
                costAnalyticService.createCostAnalytic(new CostAnalytic(targetSaving, BigDecimal.ZERO));
                System.out.println("Created.");
                return new ResponseEntity<>(targetSaving, HttpStatus.OK);
            } catch (ValidationCollectionException e) {
                return new ResponseEntity<>("Unable to create CostAnalytic. Reason: " + e.getMessage(),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        // updating
        try {
            CostAnalytic costAnalytic = costAnalyticService.updateCostAnalytic(
                    new CostAnalytic(
                            costAnalytics.get(0).getId(),
                            targetSaving,
                            costAnalytics.get(0).getUnexpected() == null ?
                                    BigDecimal.ZERO : costAnalytics.get(0).getUnexpected()));
            System.out.println("Updated.");
            return new ResponseEntity<>(costAnalytic, HttpStatus.OK);
        } catch (ValidationCollectionException e) {
            // TODO: 29.10.22 г. Remove this, its redundant
            return new ResponseEntity<>("CostAnalytic with id " + costAnalytics.get(0).getId() + " is not found.", HttpStatus.NOT_FOUND);
        }

    }

}
