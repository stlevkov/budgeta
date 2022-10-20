package com.mybudget.app.model;

import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.Date;

@Document(collection = "expenses")
public class Expense extends TransactionType{
    public Expense(String id, @NotNull String name, @NotNull String description, @NotNull BigDecimal value, Date updatedAt) {
        super(id, name, description, value, updatedAt);
    }
}
