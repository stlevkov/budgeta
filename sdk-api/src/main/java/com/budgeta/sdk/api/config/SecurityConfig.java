package com.budgeta.sdk.api.config;


import com.budgeta.sdk.api.auth.Oauth2LoginFailureHandler;
import com.budgeta.sdk.api.auth.Oauth2LoginSuccessHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private Oauth2LoginSuccessHandler oauth2LoginSuccessHandler;

    @Autowired
    private Oauth2LoginFailureHandler oauth2LoginFailureHandler;

    @Value("${spring.websecurity.debug}")
    boolean webSecurityDebug;

    @Value("${frontend.url}")
    private String frontendURL;

    @Value("${frontend.port}")
    private String frontendPORT;

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.debug(webSecurityDebug);
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfiguration()))
                .authorizeHttpRequests(auth -> {
                    auth.anyRequest().authenticated();
                })
                .oauth2Login(oauth2 -> {
                    System.out.println("Oauth2 login triggered");
                    // oauth2.loginPage("/login").permitAll(); // upload new login page design
                    // need also @Controller GetMapping for /login and also static html page + dependency for thymeleaf
                    oauth2.successHandler(oauth2LoginSuccessHandler);
                    oauth2.failureHandler(oauth2LoginFailureHandler);
                })
                .build();
    }

    @Bean
    UrlBasedCorsConfigurationSource corsConfiguration() {
        CorsConfiguration cors = new CorsConfiguration();
        if(!frontendPORT.equals("443")) frontendURL = frontendURL + ':' + frontendPORT;
        System.out.println("FrontendURL: " + frontendURL + ", port: " + frontendPORT);
        cors.setAllowedOrigins(List.of(frontendURL)); //"Access-Control-Allow-Origin" response header
        cors.setAllowCredentials(true);
        cors.addAllowedMethod("*");
        cors.addAllowedHeader("*");
        cors.setMaxAge(60L);
        UrlBasedCorsConfigurationSource urlConfigSource = new UrlBasedCorsConfigurationSource();
        urlConfigSource.registerCorsConfiguration("/**", cors);
        return urlConfigSource;
    }

}
