package com.mybudget.app.service;

import com.mybudget.app.exception.TodoCollectionException;
import com.mybudget.app.model.TodoDTO;

import javax.validation.ConstraintViolationException;

public interface TodoService {

    void createTodo(TodoDTO todoDTO) throws ConstraintViolationException, TodoCollectionException;
}
