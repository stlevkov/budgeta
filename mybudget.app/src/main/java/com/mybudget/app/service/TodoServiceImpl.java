package com.mybudget.app.service;

import com.mybudget.app.exception.TodoCollectionException;
import com.mybudget.app.model.TodoDTO;
import com.mybudget.app.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.ConstraintViolationException;
import java.util.Date;
import java.util.Optional;

@Service
public class TodoServiceImpl implements TodoService{

    @Autowired
    private TodoRepository todoRepo;

    @Override
    public void createTodo(TodoDTO todoDTO) throws ConstraintViolationException, TodoCollectionException {
        Optional<TodoDTO> todoOpt = todoRepo.findByTodo(todoDTO.getTodo());
        if(todoOpt.isPresent()){
            throw new TodoCollectionException(TodoCollectionException.todoAlreadyExists());
        }
        System.out.println("Creating Todo");
        todoDTO.setCreatedAt(new Date());
        todoDTO.setUpdatedAt(new Date());
        todoRepo.save(todoDTO);
    }
}
