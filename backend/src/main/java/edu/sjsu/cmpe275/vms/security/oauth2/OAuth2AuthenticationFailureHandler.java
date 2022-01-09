package edu.sjsu.cmpe275.vms.security.oauth2;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@Component
public class OAuth2AuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    CustomOAuth2AuthorizationRequestRepository customOAuth2AuthorizationRequestRepository;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException {
        HttpSession session = request.getSession();
        String targetUrl = (String)session.getAttribute("redirect_uri");

        targetUrl = UriComponentsBuilder.fromUriString(targetUrl)
                .queryParam("error", exception.getLocalizedMessage())
                .build().toUriString();

        customOAuth2AuthorizationRequestRepository.removeAuthorizationRequestParams(request, response);

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    @Autowired
    public void setHttpCookieOAuth2AuthorizationRequestRepository(CustomOAuth2AuthorizationRequestRepository customOAuth2AuthorizationRequestRepository) {
        this.customOAuth2AuthorizationRequestRepository = customOAuth2AuthorizationRequestRepository;
    }
}
