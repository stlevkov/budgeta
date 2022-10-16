package com.mybudget.app.controller;

import com.mybudget.app.exception.TodoCollectionException;
import com.mybudget.app.model.TodoDTO;
import com.mybudget.app.repository.TodoRepository;
import com.mybudget.app.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.ConstraintViolationException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
public class TodoController {

    @Autowired
    private TodoRepository todoRepo;

    @Autowired
    private TodoService todoService;

    @GetMapping("/todos")
    public ResponseEntity<?> getAll(){
        System.out.println("Todos called");
        List<TodoDTO> todos = todoRepo.findAll();
        if(todos.size() > 0) {
            return new ResponseEntity<List<TodoDTO>>(todos, HttpStatus.OK);
        }
        return new ResponseEntity<>("No todos available", HttpStatus.NOT_FOUND);
    }

    @GetMapping("/todos/{id}")
    public ResponseEntity<?> getTODO(@PathVariable("id") String id){
        System.out.println("Get single TODO");
        Optional<TodoDTO> todo = todoRepo.findById(id);
        if(todo.isPresent()) {
            return new ResponseEntity<TodoDTO>(todo.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>("TODO with id " + id + " is not found.", HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/todos/{id}")
    public ResponseEntity<?> deleteTODO(@PathVariable("id") String id){
        System.out.println("Delete TODO");
        Optional<TodoDTO> todo = todoRepo.findById(id);
        if(todo.isPresent()) {
            todoRepo.delete(todo.get());
            return new ResponseEntity<>("Todo with id: " + id + " has been deleted.", HttpStatus.OK);
        }
        return new ResponseEntity<>("TODO with id " + id + " is not found.", HttpStatus.NOT_FOUND);
    }

    @PostMapping("todos")
    public ResponseEntity<?> createTodo(@RequestBody TodoDTO todoDTO){
        try{
            todoService.createTodo(todoDTO);
            return new ResponseEntity<>(todoDTO, HttpStatus.CREATED);
        } catch (ConstraintViolationException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNPROCESSABLE_ENTITY);
        } catch (TodoCollectionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @PutMapping("todos/{id}")
    public ResponseEntity<?> updateTodo(@PathVariable String id, @RequestBody TodoDTO todoDTO){
        System.out.println("Updating Todo");
        Optional<TodoDTO> todoDTOOptional = todoRepo.findById(id);
        if(todoDTOOptional.isPresent()){
            TodoDTO todo = todoDTOOptional.get();
            todo.setTodo(todoDTO.getTodo());
            todo.setUpdatedAt(new Date());
            todo.setCompleted(todoDTO.getCompleted());
            todo.setDescription(todoDTO.getDescription());
            try{
                todoRepo.save(todo);
                return new ResponseEntity<>(todo, HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>("Unable to create todo. Reason: " + e.getMessage(),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>("Unable to update todo with id " + id +
                ". Reason: Todo with this ID not found.", HttpStatus.NOT_FOUND);
    }
}
