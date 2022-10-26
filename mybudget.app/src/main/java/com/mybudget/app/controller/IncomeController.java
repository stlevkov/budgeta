package com.mybudget.app.controller;

import com.mybudget.app.exception.ValidationCollectionException;
import com.mybudget.app.model.Income;
import com.mybudget.app.repository.IncomeRepository;
import com.mybudget.app.service.IncomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.ConstraintViolationException;
import java.util.Date;
import java.util.List;
import java.util.Optional;


@RestController
public class IncomeController {

    @Autowired
    private IncomeRepository incomeRepository;
    @Autowired
    private IncomeService incomeService;

    @GetMapping("/api/incomes")
    public ResponseEntity<?> getAll(){
        System.out.println("GetAllIncomes called");
        List<Income> incomes = incomeRepository.findAll();
        if(incomes.size() > 0) {
            return new ResponseEntity<List<Income>>(incomes, HttpStatus.OK);
        }
        return new ResponseEntity<>("No Incomes available", HttpStatus.NOT_FOUND);
    }

    @GetMapping("/api/incomes/{id}")
    public ResponseEntity<?> getIncome(@PathVariable("id") String id){
        System.out.println("Get single Income");
        Optional<Income> income = incomeRepository.findById(id);
        if(income.isPresent()) {
            return new ResponseEntity<Income>(income.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>("Income with id " + id + " is not found.", HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/api/incomes/{id}")
    public ResponseEntity<?> deleteIncome(@PathVariable("id") String id){
        System.out.println("Delete Income");
        Optional<Income> incomes = incomeRepository.findById(id);
        if(incomes.isPresent()) {
            incomeRepository.delete(incomes.get());
            return new ResponseEntity<>("Income with id: " + id + " has been deleted.", HttpStatus.OK);
        }
        return new ResponseEntity<>("Income with id " + id + " is not found.", HttpStatus.NOT_FOUND);
    }

    @PostMapping("/api/incomes")
    public ResponseEntity<?> createIncome(@RequestBody Income income){
        try{
            incomeService.createIncome(income);
            return new ResponseEntity<>(income, HttpStatus.CREATED);
        } catch (ConstraintViolationException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNPROCESSABLE_ENTITY);
        } catch (ValidationCollectionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    // TODO: 20.10.22 г. Create Builder for the other Models just for fun :)
    @PutMapping("/api/incomes/{id}")
    public ResponseEntity<?> updateIncome(@PathVariable String id, @RequestBody Income income){
        System.out.println("Updating Income");
        Optional<Income> incomeOptional = incomeRepository.findById(id);
        if(incomeOptional.isPresent()){
            Income incomeUpdate = incomeOptional.get();
            incomeUpdate.setName(income.getName());
            incomeUpdate.setUpdatedAt(new Date());
            incomeUpdate.setDescription(income.getDescription());
            incomeUpdate.setValue(income.getValue());
            try{
                incomeRepository.save(incomeUpdate);
                return new ResponseEntity<>(incomeUpdate, HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>("Unable to create income. Reason: " + e.getMessage(),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>("Unable to update income with id " + id +
                ". Reason: Income with this ID not found.", HttpStatus.NOT_FOUND);
    }
}
