package com.budgeta.sdk.api.service;

import com.budgeta.sdk.api.exception.ValidationCollectionException;
import com.budgeta.sdk.api.model.User;
import com.budgeta.sdk.api.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@AllArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public User getCurrentLoggedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = (String) ((DefaultOAuth2User) authentication.getPrincipal()).getAttributes().get("email");
        return findByEmail(email).orElseThrow();
    }

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }
}
