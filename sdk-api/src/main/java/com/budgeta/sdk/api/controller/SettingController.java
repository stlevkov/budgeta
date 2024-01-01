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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.math.BigDecimal;
import java.util.List;

import static com.budgeta.sdk.api.utils.DBUtil.getExpenseList;
import static com.budgeta.sdk.api.utils.DBUtil.getUnexpectedList;
import static com.budgeta.sdk.api.utils.DBUtil.getIncomeList;

@RestController
public class SettingController {

    @PostConstruct
    public void init() {
        List<Setting> all = settingRepository.findAll();
        if (all.isEmpty()) {
            System.out.println("[SettingController] Initial setup detected. Creating initial Setting");
            settingRepository.save(new Setting(null, false));
        }
    }

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
    private BalanceRepository balanceRepository;

    @GetMapping("/api/settings")
    public ResponseEntity<?> getAll() {
        System.out.println("[GET][SETTING] find all called");
        List<Setting> settings = settingRepository.findAll();
        if(settings.isEmpty()) {
            return new ResponseEntity<>("No settings found. Initial setting needs to be created", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(settings.get(0), HttpStatus.OK);
    }

    @GetMapping("/api/settings/init_dashboard")
    public ResponseEntity<?> createInitDashboard() {
        System.out.println("[GET][SETTING] Create Init Dashboard");
        Setting setting = null;
        try {
            setting = settingService.createInitDatabaseSetup();
        } catch (ValidationCollectionException e) {
            return new ResponseEntity<>(setting, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(setting, HttpStatus.OK);
    }

    @GetMapping("/api/settings/fabric_defaults")
    public ResponseEntity<?> fabricDefaults() {
        System.out.println("[GET][SETTING] Fabric Defaults. This will remove all data from the DB");
        dashboardRepository.deleteAll();
        List<Setting> all = settingRepository.findAll();
        Setting setting = all.get(0);
        Setting newSetting = new Setting(setting.getId(),false);
        settingRepository.save(newSetting);
        costAnalyticRepository.deleteAll();
        expenseRepository.deleteAll();
        incomeRepository.deleteAll();
        unexpectedRepository.deleteAll();
        balanceRepository.deleteAll();
        return new ResponseEntity<>("All data from DB erased", HttpStatus.OK);
    }

    @GetMapping("/api/setting/fill_dummy_data")
    public ResponseEntity<?> fillDummyData() {
        System.out.println("[GET][SETTING][FILL DUMMY DATA] filling database with several dashboards");
        Dashboard dashboard1 = new Dashboard();
        dashboard1.setYear(2023);
        dashboard1.setMonth("October");
        dashboard1.setReadOnly(true);
        Dashboard dashboardSave1 = dashboardRepository.save(dashboard1);
        Dashboard dashboard2 = new Dashboard();
        dashboard2.setYear(2023);
        dashboard2.setMonth("November");
        dashboard2.setReadOnly(true);
        Dashboard dashboardSave2 = dashboardRepository.save(dashboard2);
        System.out.println("Dashboards created...");

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
