package edu.sjsu.cmpe275.vms.security.oauth2;

import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@Component
public class CustomOAuth2AuthorizationRequestRepository implements AuthorizationRequestRepository<OAuth2AuthorizationRequest> {
    public static final String AUTHORIZATION_REQUEST = "oauth2_auth_request";
    public static final String REDIRECT_URI = "redirect_uri";

    @Override
    public OAuth2AuthorizationRequest loadAuthorizationRequest(HttpServletRequest request) {
        HttpSession session = request.getSession();
        return (OAuth2AuthorizationRequest) session.getAttribute(AUTHORIZATION_REQUEST);
    }

    @Override
    public void saveAuthorizationRequest(OAuth2AuthorizationRequest authorizationRequest, HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession();
        if (authorizationRequest == null) {
            session.removeAttribute(AUTHORIZATION_REQUEST);
            session.removeAttribute(REDIRECT_URI);
            return;
        }
        session.setAttribute(AUTHORIZATION_REQUEST, authorizationRequest);
        String redirectUriAfterLogin = request.getParameter(REDIRECT_URI);
        session.setAttribute(REDIRECT_URI, redirectUriAfterLogin);
    }

    @Override
    public OAuth2AuthorizationRequest removeAuthorizationRequest(HttpServletRequest request) {
        return this.loadAuthorizationRequest(request);
    }

    public void removeAuthorizationRequestParams(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession();
        session.removeAttribute(AUTHORIZATION_REQUEST);
        session.removeAttribute(REDIRECT_URI);
    }
}
