package com.mybudget.app.service;

import com.mybudget.app.exception.TodoCollectionException;
import com.mybudget.app.model.Expense;
import com.mybudget.app.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.ConstraintViolationException;
import java.util.Date;
import java.util.Optional;

@Service
public class ExpenseServiceImpl implements ExpenseService{

    @Autowired
    private ExpenseRepository expenseRepo;

    @Override
    public void createExpense(Expense expense) throws ConstraintViolationException, TodoCollectionException {
        System.out.println("Trying to create new Expense: " + expense);
        Optional<Expense> expenseOptional = expenseRepo.findByName(expense.getName());
        System.out.println("Is the expense already present? " + expenseOptional.isPresent());
        if(expenseOptional.isPresent()){
            throw new TodoCollectionException(TodoCollectionException.todoAlreadyExists());
        }
        System.out.println("Creating Expense from the service");
        expense.setUpdatedAt(new Date());
        expenseRepo.save(expense);
    }
}
