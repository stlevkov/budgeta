package com.mybudget.app.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.Date;

@Setter
@Getter
@AllArgsConstructor
@ToString
public class TransactionType {
    @Id
    private String id;
    @NotNull
    private String name;
    @NotNull
    private String description;
    @NotNull
    private BigDecimal value;
    /**
     * Updated by the system
     */
    private Date updatedAt;
}
