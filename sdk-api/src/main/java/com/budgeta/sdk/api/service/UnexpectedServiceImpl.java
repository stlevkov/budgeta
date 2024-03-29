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
package com.budgeta.sdk.api.service;

import com.budgeta.sdk.api.exception.ValidationCollectionException;
import com.budgeta.sdk.api.model.Expense;
import com.budgeta.sdk.api.model.Unexpected;
import com.budgeta.sdk.api.repository.UnexpectedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.ConstraintViolationException;
import java.util.Date;
import java.util.Optional;

@Service
public class UnexpectedServiceImpl implements UnexpectedService {

    @Autowired
    private UnexpectedRepository unexpectedRepo;

    @Override
    public void createUnexpected(Unexpected unexpected) throws ConstraintViolationException, ValidationCollectionException {
        Optional<Unexpected> unexpectedOptional = unexpectedRepo.findByNameAndDashboardId(unexpected.getName(), unexpected.getDashboardId());
        if(unexpectedOptional.isPresent()){
            throw new ValidationCollectionException(ValidationCollectionException.alreadyExists());
        }
        unexpected.setUpdatedAt(new Date());
        unexpectedRepo.save(unexpected);
    }

    @Override
    public void updateUnexpected(Unexpected unexpected) throws ConstraintViolationException, ValidationCollectionException {
        Optional<Unexpected> unexpectedOptional = unexpectedRepo.findById(unexpected.getId());
        if (unexpectedOptional.isPresent()) {
            unexpected.setUpdatedAt(new Date());
            unexpectedRepo.save(unexpected);
        } else {
            throw new ValidationCollectionException(ValidationCollectionException.notFound(unexpected.getId()));
        }
    }
}