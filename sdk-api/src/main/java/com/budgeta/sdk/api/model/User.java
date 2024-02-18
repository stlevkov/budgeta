package com.budgeta.sdk.api.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotNull;
import java.util.List;

@Data
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @NotNull
    private String name;

    @NotNull
    private String email;

    @NotNull
    private UserRole role;

    @NotNull
    private List<String> remoteAddresses;

    @NotNull
    private String avatarURL;

    @NotNull
    private RegisterProvider registerProvider;
}
