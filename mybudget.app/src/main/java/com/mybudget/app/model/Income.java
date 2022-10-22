package com.mybudget.app.model;

import lombok.ToString;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.Date;

@Document(collection = "incomes")
public class Income extends TransactionType{
    public Income(String id, @NotNull String name, @NotNull String description, @NotNull BigDecimal value, Date updatedAt) {
        super(id, name, description, value, updatedAt);
    }
}
