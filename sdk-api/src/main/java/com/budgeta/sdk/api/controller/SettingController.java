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
import com.budgeta.sdk.api.model.*;
import com.budgeta.sdk.api.repository.*;
import com.budgeta.sdk.api.service.SettingService;
import com.budgeta.sdk.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

import static com.budgeta.sdk.api.utils.DBUtil.getExpenseList;
import static com.budgeta.sdk.api.utils.DBUtil.getUnexpectedList;
import static com.budgeta.sdk.api.utils.DBUtil.getIncomeList;

@RestController
public class SettingController {

    @Autowired
    UserService userService;

    @Autowired
    private SettingRepository settingRepository;

    @Autowired
    private SettingService settingService;

    @Autowired
    private CostAnalyticRepository costAnalyticRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private UnexpectedRepository unexpectedRepository;

    @Autowired
    private DashboardRepository dashboardRepository;

    @Autowired
    private BalanceAccountTransactionRepository balanceAccountTransactionRepository;

    @GetMapping("/api/settings")
    public ResponseEntity<?> getAll() {
        System.out.println("[GET][Setting] find all called");
        List<Setting> settings = settingRepository.findByUserId(userService.getCurrentLoggedUser().getId());
        if(settings.isEmpty()) {
            return new ResponseEntity<>("No settings found. Initial setting needs to be created for the current user", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(settings.get(0), HttpStatus.OK);
    }

    @GetMapping("/api/settings/init_dashboard")
    public ResponseEntity<?> createInitDashboard() {
        System.out.println("[GET][Setting] Create Init Dashboard");
        Setting setting = null;
        try {
            setting = settingService.createInitDatabaseSetup();
        } catch (ValidationCollectionException e) {
            return new ResponseEntity<>(setting, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(setting, HttpStatus.OK);
    }

    @GetMapping("/admin/api/settings/fabric_defaults")
    public ResponseEntity<?> fabricDefaults() {
        // TODO - Remove only the user associated resources, not all of them
        System.out.println("[GET][Setting] Fabric Defaults. This will remove all data from the DB");
        dashboardRepository.deleteAll();
        settingRepository.deleteAll();
        costAnalyticRepository.deleteAll();
        expenseRepository.deleteAll();
        incomeRepository.deleteAll();
        unexpectedRepository.deleteAll();
        balanceAccountTransactionRepository.deleteAll();
        System.out.println("Current user: " + userService.getCurrentLoggedUser());
        Setting newSetting = new Setting(null,false, userService.getCurrentLoggedUser().getId());
        settingRepository.save(newSetting);
        return new ResponseEntity<>("All data from DB erased", HttpStatus.OK);
    }

    @GetMapping("/admin/api/setting/fill_dummy_data")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> fillDummyData() {
        System.out.println("[GET][Setting] filling database with several dashboards");
        Dashboard dashboard1 = new Dashboard();
        dashboard1.setYear(2023);
        dashboard1.setMonth(10);
        dashboard1.setReadOnly(true);
        Dashboard dashboardSave1 = dashboardRepository.save(dashboard1);
        Dashboard dashboard2 = new Dashboard();
        dashboard2.setYear(2023);
        dashboard2.setMonth(11);
        dashboard2.setReadOnly(true);
        Dashboard dashboardSave2 = dashboardRepository.save(dashboard2);

        CostAnalytic costAnalytic = new CostAnalytic();
        costAnalytic.setTargetSaving(BigDecimal.valueOf(1500));
        costAnalytic.setName("Cost Analytic");
        costAnalytic.setBalanceAccount(BigDecimal.valueOf(6500));
        costAnalytic.setMonthlyTarget(BigDecimal.valueOf(800));
        costAnalytic.setDailyRecommended(BigDecimal.valueOf(78.24));
        costAnalytic.setDashboardId(dashboardSave1.getId());
        costAnalyticRepository.save(costAnalytic);
        CostAnalytic costAnalytic2 = new CostAnalytic();
        costAnalytic2.setTargetSaving(BigDecimal.valueOf(1000));
        costAnalytic2.setName("Cost Analytic");
        costAnalytic2.setBalanceAccount(BigDecimal.valueOf(8000));
        costAnalytic2.setMonthlyTarget(BigDecimal.valueOf(900));
        costAnalytic2.setDailyRecommended(BigDecimal.valueOf(99.24));
        costAnalytic2.setDashboardId(dashboardSave2.getId());
        costAnalyticRepository.save(costAnalytic2);
        System.out.println("Cost Analytics created...");

        List<Expense> expenses = getExpenseList(dashboardSave1, dashboardSave2);
        expenses.forEach(e -> expenseRepository.save(e));
        System.out.println("Expenses created...");

        List<Unexpected> unexpecteds = getUnexpectedList(dashboardSave1, dashboardSave2);
        unexpecteds.forEach(u -> unexpectedRepository.save(u));
        System.out.println("Unexpecteds created...");

        List<Income> incomes = getIncomeList(dashboardSave1, dashboardSave2);
        incomes.forEach(i -> incomeRepository.save(i));
        System.out.println("Incomes created...");

        return new ResponseEntity<>("Dummy data created in DB.", HttpStatus.OK);
    }



}
