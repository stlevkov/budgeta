package com.budgeta.sdk.api.logging;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@Slf4j
public class LoggingFilter extends OncePerRequestFilter { // TODO This works well, needs to be improved more
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        log.info("Handling incoming request: {}, {}", request.getRequestURI(), request.getMethod());

        //response.setHeader("Access-Control-Allow-Credentials", "true"); // Test if it's working with Azure App Service

        filterChain.doFilter(request, response);
    }
}
