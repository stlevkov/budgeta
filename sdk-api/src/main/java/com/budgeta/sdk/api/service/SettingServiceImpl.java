/*
    Budgeta Application
    Copyright (C) 2022 - 2023  S.K.Levkov, K.K.Ivanov

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
 */
package com.budgeta.sdk.api.service;

import com.budgeta.sdk.api.model.*;
import com.budgeta.sdk.api.repository.CostAnalyticRepository;
import com.budgeta.sdk.api.repository.DashboardRepository;
import com.budgeta.sdk.api.repository.SettingRepository;
import com.budgeta.sdk.api.utils.DateUtils;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.ConstraintViolationException;
import java.math.BigDecimal;

@Service
@AllArgsConstructor
public class SettingServiceImpl implements SettingService {

    @Autowired
    DashboardRepository dashboardRepository;

    @Autowired
    CostAnalyticRepository costAnalyticRepository;

    @Autowired
    SettingRepository settingRepository;

    @Autowired
    UserService userService;

    @Override
    public Setting createInitDatabaseSetup() throws ConstraintViolationException {
        User currentLoggedUser = userService.getCurrentLoggedUser();
        Dashboard dashboard = dashboardRepository.save(new Dashboard(null, DateUtils.getCurrentMonth(), DateUtils.getCurrentYear(),
                false, currentLoggedUser.getId()));
        Setting setting = settingRepository.findByUserId(currentLoggedUser.getId()).get(0);
        setting.setInitialized(true);
        System.out.println("Creating initial Dashboard for user: " + currentLoggedUser.getName());
        costAnalyticRepository.save(new CostAnalytic( null, "Analytics",
                BigDecimal.ZERO, BigDecimal.ZERO,  BigDecimal.ZERO,  BigDecimal.ZERO,  dashboard.getId()
        ));
        return settingRepository.save(setting);
    }
}
