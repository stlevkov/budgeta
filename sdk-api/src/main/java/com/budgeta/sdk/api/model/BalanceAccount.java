package com.budgeta.sdk.api.model;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Document(collection = "balance_accounts")
public class BalanceAccount extends DocumentInfo {

     @DBRef
     @NotNull
     private User user;

     /**
      * If false, the balance account is used only for storing data and not for calculations.
      * For example, the UI shall not include it in the AllSum calculation on the dashboard.
      * The value can still be changed via new Transactions.
      */
     @NotNull
     private Boolean active; // TODO - can be enum if more types needed

     /**
      * The primary account is used by the system when making transactions for moving the savings
      * when new month begins. TODO - can be improved with bindings
      */
     @NotNull
     private Boolean primary;

     @DBRef
     private List<BalanceAccountTransaction> balanceAccountTransactions;

     public BalanceAccount(String id, @NotNull String name, @NotNull String description, @NotNull BigDecimal value, Date updatedAt, String dashboardId) {
          super(id, name, description, value, updatedAt, dashboardId);
     }

}
