package com.mybudget.app.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.Date;

@Setter
@Getter
@Document(collection = "savings")
public class Saving extends TransactionType{
    @NotNull
    private String location;
    @NotNull
    private String purpose;

    public Saving(String id, @NotNull String name, @NotNull String description, @NotNull BigDecimal value, Date updatedAt) {
        super(id, name, description, value, updatedAt);
    }
}
