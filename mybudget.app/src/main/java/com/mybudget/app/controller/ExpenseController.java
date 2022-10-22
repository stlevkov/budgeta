package com.mybudget.app.controller;

import com.mybudget.app.exception.TodoCollectionException;
import com.mybudget.app.model.Expense;
import com.mybudget.app.model.Expense;
import com.mybudget.app.repository.ExpenseRepository;
import com.mybudget.app.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.ConstraintViolationException;
import java.util.Date;
import java.util.List;
import java.util.Optional;


@RestController
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;
    @Autowired
    private ExpenseService expenseService;

    @GetMapping("/api/expenses")
    public ResponseEntity<?> getAll(){
        System.out.println("Get All Expenses called");
        List<Expense> expenses = expenseRepository.findAll();
        if(expenses.size() > 0) {
            return new ResponseEntity<List<Expense>>(expenses, HttpStatus.OK);
        }
        return new ResponseEntity<>("No Expenses available", HttpStatus.NOT_FOUND);
    }

    @GetMapping("/api/expenses/{id}")
    public ResponseEntity<?> getExpense(@PathVariable("id") String id){
        System.out.println("Get single Expense");
        Optional<Expense> expense = expenseRepository.findById(id);
        if(expense.isPresent()) {
            return new ResponseEntity<Expense>(expense.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>("Expense with id " + id + " is not found.", HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/api/expenses/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable("id") String id){
        System.out.println("Delete Expense");
        Optional<Expense> expenses = expenseRepository.findById(id);
        if(expenses.isPresent()) {
            expenseRepository.delete(expenses.get());
            return new ResponseEntity<>("Expense with id: " + id + " has been deleted.", HttpStatus.OK);
        }
        return new ResponseEntity<>("Expense with id " + id + " is not found.", HttpStatus.NOT_FOUND);
    }

    @PostMapping("/api/expenses")
    public ResponseEntity<?> createExpense(@RequestBody Expense expense){
        try{
            expenseService.createExpense(expense);
            return new ResponseEntity<>(expense, HttpStatus.CREATED);
        } catch (ConstraintViolationException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNPROCESSABLE_ENTITY);
        } catch (TodoCollectionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @PutMapping("/api/expenses/{id}")
    public ResponseEntity<?> updateExpense(@PathVariable String id, @RequestBody Expense expense){
        System.out.println("Updating Expense");
        Optional<Expense> expenseOptional = expenseRepository.findById(id);
        if(expenseOptional.isPresent()){
            Expense expenseUpdate = expenseOptional.get();
            expenseUpdate.setName(expense.getName());
            expenseUpdate.setUpdatedAt(new Date());
            expenseUpdate.setDescription(expense.getDescription());
            expenseUpdate.setValue(expense.getValue());
            try{
                expenseRepository.save(expenseUpdate);
                return new ResponseEntity<>(expenseUpdate, HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>("Unable to create expense. Reason: " + e.getMessage(),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>("Unable to update expense with id " + id +
                ". Reason: Expense with this ID not found.", HttpStatus.NOT_FOUND);
    }
}
