package com.mybudget.app.service;

import com.mybudget.app.exception.TodoCollectionException;
import com.mybudget.app.model.Saving;

import javax.validation.ConstraintViolationException;

public interface SavingService {
    void createSaving(Saving saving) throws ConstraintViolationException, TodoCollectionException;
}
