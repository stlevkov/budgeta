package com.mybudget.app.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotNull;
import java.util.Date;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "todos")
public class TodoDTO {
    @Id
    private String id;
    @NotNull
    private String todo;
    @NotNull
    private String description;
    @NotNull
    private Boolean completed;
    @NotNull
    private Date createdAt;
    /**
     * Updated by the system
     */
    private Date updatedAt;
}
