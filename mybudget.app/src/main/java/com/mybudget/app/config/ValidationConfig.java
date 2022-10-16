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
