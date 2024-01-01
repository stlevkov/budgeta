/*
    Budgeta Application
    Copyright (C) 2022 - 2023  S.Levkov, K.Ivanov

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
import com.budgeta.sdk.api.model.Dashboard;
import com.budgeta.sdk.api.repository.DashboardRepository;
import com.budgeta.sdk.api.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.ConstraintViolationException;
import java.util.List;
import java.util.Optional;

@RestController
public class DashboardController {

    @Autowired
    private DashboardRepository dashboardRepository;
    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/api/dashboards/delete_all")
    public ResponseEntity<?> deleteAll(){
        dashboardRepository.deleteAll();
        return new ResponseEntity<>("All dashboard deleted", HttpStatus.OK);
    }

    @GetMapping("/api/dashboards/import_initial")
    public ResponseEntity<?> importInitial(){
        Dashboard dashboardOctober = new Dashboard("651b2fffeee58ca5e54c7b9d",
                "October", 2023, false);
        Dashboard dashboardNovember = new Dashboard("654194c40f244171d6e191ff",
                "November", 2023, false);
        dashboardRepository.save(dashboardOctober);
        dashboardRepository.save(dashboardNovember);
        return new ResponseEntity<>("All dashboard imported", HttpStatus.OK);
    }

    @GetMapping("/api/dashboards")
    public ResponseEntity<?> getAll(){
        System.out.println("GetAllDashboards called");
        List<Dashboard> dashboards = dashboardRepository.findAll();
        if(!dashboards.isEmpty()) {
            return new ResponseEntity<>(dashboards, HttpStatus.OK);
        }
        return new ResponseEntity<>("No dashboards available", HttpStatus.NO_CONTENT);
    }

    @GetMapping("/api/dashboards/aggregation")
    public ResponseEntity<?> getAllAggregation(){
        System.out.println("[GET][Dashboard Aggregation] getAllAggregation");
        return new ResponseEntity<>(dashboardRepository.getAggregatedDashboards(), HttpStatus.ACCEPTED);
    }

    @GetMapping("/api/dashboards/{year}/{month}")
    public ResponseEntity<?> getDashboardByYearAndMonth(
            @PathVariable("year") int year, @PathVariable("month") String month) {
        System.out.println("[GET][Dashboard] GetDashboardsByYearAndMonth called with Year: " + year + " and Month: " + month);
        List<Dashboard> dashboards = dashboardRepository.findByYearAndMonth(year, month);

        //TODO replace the body response message with object of type BudgetaError

        if (dashboards.isEmpty()) {
            return new ResponseEntity<>("No dashboards available for the specified year and month", HttpStatus.NOT_FOUND);
        } else if (dashboards.size() == 1) {
            return new ResponseEntity<>(dashboards.get(0), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Multiple dashboards found for the specified year and month", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/api/dashboards/{id}")
    public ResponseEntity<?> getDashboard(@PathVariable("id") String id){
        System.out.println("Get single dashboard");
        Optional<Dashboard> dashboard = dashboardRepository.findById(id);
        if(dashboard.isPresent()) {
            return new ResponseEntity<>(dashboard.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>("dashboard with id " + id + " is not found.", HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/api/dashboards/{id}")
    public ResponseEntity<?> deleteDashboard(@PathVariable("id") String id){
        System.out.println("Delete dashboard");
        Optional<Dashboard> dashboards = dashboardRepository.findById(id);
        if(dashboards.isPresent()) {
            dashboardRepository.delete(dashboards.get());
            return new ResponseEntity<>("dashboard with id: " + id + " has been deleted.", HttpStatus.OK);
        }
        return new ResponseEntity<>("dashboard with id " + id + " is not found.", HttpStatus.NOT_FOUND);
    }

    @PostMapping("/api/dashboards")
    public ResponseEntity<?> createDashboard(@RequestBody Dashboard dashboard){
        System.out.println("[POST][Dashboard] createDashboard: " + dashboard);
        try{
            dashboardService.createDashboard(dashboard);
            return new ResponseEntity<>(dashboard, HttpStatus.CREATED);
        } catch (ConstraintViolationException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNPROCESSABLE_ENTITY);
        } catch (ValidationCollectionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }
}
