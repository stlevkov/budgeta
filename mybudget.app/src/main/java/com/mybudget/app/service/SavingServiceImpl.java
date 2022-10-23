package com.mybudget.app.service;

import com.mybudget.app.exception.TodoCollectionException;
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
    public void createSaving(Saving saving) throws ConstraintViolationException, TodoCollectionException {
        System.out.println("Trying to create new Saving: " + saving);
        Optional<Saving> savingOptional = savingRepo.findByName(saving.getName());
        System.out.println("Is the saving already present? " + savingOptional.isPresent());
        if(savingOptional.isPresent()){
            throw new TodoCollectionException(TodoCollectionException.todoAlreadyExists());
        }
        System.out.println("Creating Saving from the service");
        saving.setUpdatedAt(new Date());
        savingRepo.save(saving);
    }
}
