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
package com.mybudget.app.service;

import com.mybudget.app.exception.ValidationCollectionException;
import com.mybudget.app.model.Saving;
import com.mybudget.app.repository.SavingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.ConstraintViolationException;
import java.util.Date;
import java.util.Optional;

@Service
public class SavingServiceImpl implements SavingService {

    @Autowired
    private SavingRepository savingRepo;

    @Override
    public void createSaving(Saving saving) throws ConstraintViolationException, ValidationCollectionException {
        System.out.println("Trying to create new Saving: " + saving);
        Optional<Saving> savingOptional = savingRepo.findByName(saving.getName());
        System.out.println("Is the saving already present? " + savingOptional.isPresent());
        if(savingOptional.isPresent()){
            throw new ValidationCollectionException(ValidationCollectionException.alreadyExists());
        }
        System.out.println("Creating Saving from the service");
        saving.setUpdatedAt(new Date());
        savingRepo.save(saving);
    }
}
