package com.budgeta.sdk.api.auth;

import com.budgeta.sdk.api.model.RegisterProvider;
import com.budgeta.sdk.api.model.Setting;
import com.budgeta.sdk.api.model.User;
import com.budgeta.sdk.api.model.UserRole;
import com.budgeta.sdk.api.repository.SettingRepository;
import com.budgeta.sdk.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.OAuth2AuthorizationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@Component
public class Oauth2LoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    @Value("${frontend.url}")
    private String frontendURL;

    @Value("${frontend.port}")
    private String frontendPORT;

    @Value("${single.user.email}")
    private String singleUserEmail;

    @Autowired
    private UserService userService;

    @Autowired
    private SettingRepository settingRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException {
        this.setAlwaysUseDefaultTargetUrl(true);
        if(!frontendPORT.equals("443")) frontendURL = frontendURL + ':' + frontendPORT;
        this.setDefaultTargetUrl(frontendURL); // TODO - implement router if the Rest API will be used for other purposes

        OAuth2AuthenticationToken oAuth2AuthenticationToken = (OAuth2AuthenticationToken) authentication;
        String authorizedClientRegistrationId = oAuth2AuthenticationToken.getAuthorizedClientRegistrationId();
        if("github".equals(authorizedClientRegistrationId)){
            DefaultOAuth2User principal = (DefaultOAuth2User) authentication.getPrincipal();
            WebAuthenticationDetails details = (WebAuthenticationDetails) authentication.getDetails();
            Map<String, Object> attributes = principal.getAttributes();
            String email = (String) attributes.get("email");
            if(email == null) {
                SecurityContextHolder.getContext().setAuthentication(null); // clear context
                throw new OAuth2AuthorizationException(new OAuth2Error("1000",
                        "Email address not provided by the provider. " +
                                "Check if your email address is private in the provider email privacy settings.",""));
            }
            System.out.println("Email candidate: " + email + ", set singleUserEmail: " + singleUserEmail);
            if(!singleUserEmail.isEmpty() && !email.equals(singleUserEmail)){
                SecurityContextHolder.getContext().setAuthentication(null); // clear context
                throw new OAuth2AuthorizationException(new OAuth2Error("1001", "Registrations disabled", ""));
            }
            String name = (String) attributes.getOrDefault("name", "Update your name");
            String avatarURL = (String) attributes.getOrDefault("avatar_url", "Update your avatar URL");
            userService.findByEmail(email).ifPresentOrElse(user -> { // register
                List<SimpleGrantedAuthority> simpleGrantedAuthorities = List.of(new SimpleGrantedAuthority(user.getRole().name()));
                DefaultOAuth2User newUser = new DefaultOAuth2User(simpleGrantedAuthorities, attributes, "id");
                Authentication securityAuth = new OAuth2AuthenticationToken(newUser, simpleGrantedAuthorities, authorizedClientRegistrationId);
                SecurityContextHolder.getContext().setAuthentication(securityAuth);
            }, () -> {
                User userEntity = new User();
                userEntity.setRole(UserRole.ROLE_USER);
                userEntity.setEmail(email);
                userEntity.setName(name);
                userEntity.setRegisterProvider(RegisterProvider.GITHUB);
                userEntity.setAvatarURL(avatarURL);
                userEntity.setRemoteAddresses(List.of(details.getRemoteAddress()));
                User saved = userService.save(userEntity);
                settingRepository.save(new Setting(null, false, saved.getId()));
                List<SimpleGrantedAuthority> simpleGrantedAuthorities = List.of(new SimpleGrantedAuthority(userEntity.getRole().name()));
                DefaultOAuth2User newUser = new DefaultOAuth2User(simpleGrantedAuthorities, attributes, "id");
                Authentication securityAuth = new OAuth2AuthenticationToken(newUser, simpleGrantedAuthorities, authorizedClientRegistrationId);
                SecurityContextHolder.getContext().setAuthentication(securityAuth);
            });
            // TODO match the provider
        }

        super.onAuthenticationSuccess(request, response, authentication);
    }
}
