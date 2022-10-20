package com.mybudget.app.repository;

import com.mybudget.app.model.Income;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;

public interface IncomeRepository extends MongoRepository<Income, String> {

    @Query("income : ?0}")
    Optional<Income> findByName(String name);
}
