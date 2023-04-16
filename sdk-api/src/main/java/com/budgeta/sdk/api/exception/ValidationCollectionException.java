/*
    Budgeta Application
    Copyright (C) 2022  S.Levkov, K.Ivanov

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
 */
package com.budgeta.sdk.api.exception;

public class ValidationCollectionException extends Exception {
    private static final long serialVersionUID = 1L;

    public ValidationCollectionException(String message){
        super(message);
    }

    public static String todoNotFound(String id){
        return "Item with " + id + " not found.";
    }

    public static String alreadyExists(){
        return "Item with given name already Exists";
    }
}
