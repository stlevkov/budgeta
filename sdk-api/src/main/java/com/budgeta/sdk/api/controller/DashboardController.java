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
import com.budgeta.sdk.api.model.Setting;
import com.budgeta.sdk.api.repository.DashboardRepository;
import com.budgeta.sdk.api.repository.SettingRepository;
import com.budgeta.sdk.api.service.DashboardService;
import com.budgeta.sdk.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.ConstraintViolationException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
public class DashboardController {

    @Autowired
    private DashboardRepository dashboardRepository;
    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private SettingRepository settingRepository;

    @Autowired
    UserService userService;

    @GetMapping("/api/dashboards/delete_all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAll(){
        dashboardRepository.deleteAll();
        return new ResponseEntity<>("All dashboard deleted", HttpStatus.OK);
    }

    @GetMapping("/api/dashboards")
    public ResponseEntity<?> getAll() {
        System.out.println("GetAllDashboards called for user: " + userService.getCurrentLoggedUser());
        List<Dashboard> dashboards = dashboardService.getDashboards();
        if(!dashboards.isEmpty()) {
            return new ResponseEntity<>(dashboards, HttpStatus.OK);
        }
        return new ResponseEntity<>("No dashboards available", HttpStatus.NO_CONTENT);
    }

    @GetMapping("/api/dashboards/aggregation")
    public ResponseEntity<?> getAllAggregation() {
        System.out.println("[GET][Dashboard Aggregation] getAllAggregation");

        // Get the current month as a number
        int currentMonth = LocalDate.now().getMonthValue();
        System.out.println("Current Month: " + currentMonth);
        // Call the repository method with the current month
        List<Dashboard> aggregatedDashboards = dashboardRepository.getAggregatedDashboards();

        return new ResponseEntity<>(aggregatedDashboards, HttpStatus.ACCEPTED);
    }

    @GetMapping("/api/dashboards/min")
    public ResponseEntity<?> getFirstDashboard(){
        System.out.println("[GET][Dashboard][Min] get the first available dashboard from the past");
        List<Dashboard> all = dashboardRepository.findAll(Sort.by(Sort.Direction.ASC, "year", "month"));
        if(all.isEmpty()){
            return new ResponseEntity<>("Not found", HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(all.get(0), HttpStatus.OK);
    }

    @GetMapping("/api/dashboards/{year}/{month}")
    public ResponseEntity<?> getDashboardByYearAndMonth(
            @PathVariable("year") int year, @PathVariable("month") int month) {
        System.out.println("[GET][Dashboard] GetDashboardsByYearAndMonth called with Year: " + year + " and Month: " + month);
        List<Dashboard> dashboards = dashboardRepository.findByYearAndMonthAndUserId(year, month, userService.getCurrentLoggedUser().getId());
        List<Setting> settings = settingRepository.findAll();
        //TODO replace the body response message with object of type BudgetaError
        System.out.println("Called for user: " + userService.getCurrentLoggedUser());
        if (dashboards.isEmpty() && settings.get(0).getInitialized()) {
            System.out.println("No dashboards found and the settings are Initialized. Will transfer to new dashboard...");
            Dashboard dashboard = null;
            try {
                dashboard = dashboardService.transferDataAndCreateDashboard(year, month);
            } catch (ValidationCollectionException e) {
                throw new RuntimeException(e);
            }
            return new ResponseEntity<>(dashboard, HttpStatus.OK);
        } else if (dashboards.size() == 1) {
            return new ResponseEntity<>(dashboards.get(0), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Multiple dashboards found for the specified year and month",
                    HttpStatus.BAD_REQUEST);
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
