package com.mybudget.app.repository;

import com.mybudget.app.model.Saving;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;

public interface SavingRepository extends MongoRepository<Saving, String> {

    @Query("{name : ?0}")
    Optional<Saving> findByName(String name);
}
