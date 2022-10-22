package com.mybudget.app.service;

import com.mybudget.app.exception.TodoCollectionException;
import com.mybudget.app.model.Income;
import com.mybudget.app.repository.IncomeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.ConstraintViolationException;
import java.util.Date;
import java.util.Optional;

@Service
public class IncomeServiceImpl implements IncomeService{

    @Autowired
    private IncomeRepository incomeRepo;

    @Override
    public void createIncome(Income income) throws ConstraintViolationException, TodoCollectionException {
        System.out.println("Trying to create new Income: " + income);
        Optional<Income> incomeOptional = incomeRepo.findByName(income.getName());
        System.out.println("Is the income already present? " + incomeOptional.isPresent());
        if(incomeOptional.isPresent()){
            throw new TodoCollectionException(TodoCollectionException.todoAlreadyExists());
        }
        System.out.println("Creating Income from the service");
        income.setUpdatedAt(new Date());
        incomeRepo.save(income);
    }
}
