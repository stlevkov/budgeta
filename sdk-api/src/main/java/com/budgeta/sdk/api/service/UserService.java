package com.budgeta.sdk.api.service;

import com.budgeta.sdk.api.model.User;

import java.util.Optional;

public interface UserService {

    Optional<User> findByEmail(String email);

    User getCurrentLoggedUser();

    User save(User user);
}
