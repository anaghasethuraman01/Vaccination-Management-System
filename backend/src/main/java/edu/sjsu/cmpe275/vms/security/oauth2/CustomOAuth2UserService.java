package edu.sjsu.cmpe275.vms.security.oauth2;

import edu.sjsu.cmpe275.vms.exception.EmailNotVerifiedException;
import edu.sjsu.cmpe275.vms.exception.OAuth2AuthenticationProcessingException;
import edu.sjsu.cmpe275.vms.model.Address;
import edu.sjsu.cmpe275.vms.model.AuthProvider;
import edu.sjsu.cmpe275.vms.model.Role;
import edu.sjsu.cmpe275.vms.model.User;
import edu.sjsu.cmpe275.vms.repository.UserRepository;
import edu.sjsu.cmpe275.vms.security.UserPrincipal;
import edu.sjsu.cmpe275.vms.security.oauth2.user.OAuth2UserInfo;
import edu.sjsu.cmpe275.vms.security.oauth2.user.OAuth2UserInfoFactory;
import edu.sjsu.cmpe275.vms.util.EmailUtils;
import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import com.nimbusds.oauth2.sdk.util.StringUtils;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;
import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);
        try {
            return processOAuth2User(oAuth2UserRequest, oAuth2User);
        } catch (AuthenticationException ex) {
            throw ex;
        } catch (Exception ex) {
            // Throwing an instance of AuthenticationException will trigger the OAuth2AuthenticationFailureHandler
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest oAuth2UserRequest, OAuth2User oAuth2User) throws MessagingException, UnsupportedEncodingException {
        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(oAuth2UserRequest.getClientRegistration().getRegistrationId(), oAuth2User.getAttributes());
        if(StringUtils.isBlank(oAuth2UserInfo.getEmail())) {
            throw new OAuth2AuthenticationProcessingException("Email not found from OAuth2 provider");
        }

        Optional<User> userOptional = userRepository.findByEmail(oAuth2UserInfo.getEmail());
        User user;
        if(userOptional.isPresent()) {
            user = userOptional.get();
            if(!user.getProvider().equals(AuthProvider.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId()))) {
                throw new OAuth2AuthenticationProcessingException("You've signed up with " +
                        user.getProvider() + " account. Please use your " + user.getProvider() +
                        " account to login.");
            }
            user = updateExistingUser(user, oAuth2UserInfo);
            if(!user.getEmailVerified()) {
                throw new EmailNotVerifiedException("Please verify your email to login.");
            }
        } else {
            registerNewUser(oAuth2UserRequest, oAuth2UserInfo);
            throw new EmailNotVerifiedException("Please verify your email to login.");
        }

        return UserPrincipal.create(user, oAuth2User.getAttributes());
    }

    private User registerNewUser(OAuth2UserRequest oAuth2UserRequest, OAuth2UserInfo oAuth2UserInfo) throws MessagingException, UnsupportedEncodingException {
        User user = new User();
        user.setProvider(AuthProvider.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId()));
        user.setProviderId(oAuth2UserInfo.getId());
        user.setFirstName(oAuth2UserInfo.getFirstName());
        user.setLastName(oAuth2UserInfo.getLastName());
        user.setEmail(oAuth2UserInfo.getEmail());
        user.setRole(Role.Patient);
        user.setVerificationCode(RandomString.make(64));
        user.setAddress(new Address("112", "San Jose", "CA", 95113));
        User savedUser = userRepository.save(user);

        String siteURL = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
        EmailUtils.sendVerificationEmail(user, siteURL);

        return savedUser;
    }

    private User updateExistingUser(User existingUser, OAuth2UserInfo oAuth2UserInfo) {
        existingUser.setFirstName(oAuth2UserInfo.getFirstName());
        existingUser.setLastName(oAuth2UserInfo.getLastName());
        return userRepository.save(existingUser);
    }

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
