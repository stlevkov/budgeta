package com.mybudget.app.exception;

public class TodoCollectionException extends Exception {
    private static final long serialVersionUID = 1L;

    public TodoCollectionException(String message){
        super(message);
    }

    public static String todoNotFound(String id){
        return "Todo with " + id + " not found.";
    }

    public static String todoAlreadyExists(){
        return "Todo with given name already Exists";
    }
}
