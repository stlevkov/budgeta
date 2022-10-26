/*
    Budgeta Application
    Copyright (C) 2022  S.K.Levkov, K.K.Ivanov

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
 */
package com.mybudget.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.mapping.event.ValidatingMongoEventListener;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

@Configuration
public class ValidationConfig {

    /**
     * Preventing user to send Null values to the Database.
     * Use @NotNull on each DTO property to prevent null values.
     * @return
     */
    @Bean
    public ValidatingMongoEventListener getValidatingMongoEventListener(){
        return new ValidatingMongoEventListener(getValidator());
    }

    @Bean
    public LocalValidatorFactoryBean getValidator(){
        return new LocalValidatorFactoryBean();
    }
}
