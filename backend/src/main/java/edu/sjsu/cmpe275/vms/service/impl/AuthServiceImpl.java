package edu.sjsu.cmpe275.vms.service.impl;

import edu.sjsu.cmpe275.vms.exception.BadRequestException;
import edu.sjsu.cmpe275.vms.model.*;
import edu.sjsu.cmpe275.vms.payload.SignUpRequest;
import edu.sjsu.cmpe275.vms.repository.UserRepository;
import edu.sjsu.cmpe275.vms.service.AuthService;
import edu.sjsu.cmpe275.vms.util.DateUtils;
import edu.sjsu.cmpe275.vms.util.EmailUtils;
import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;

@Service
public class AuthServiceImpl implements AuthService {

    private UserRepository userRepository;

    private PasswordEncoder passwordEncoder;

    @Override
    public User registerUser(SignUpRequest signUpRequest, String siteURL) throws MessagingException, UnsupportedEncodingException {

        if(userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new BadRequestException("Email address already in use.");
        }

        User user = new User();
        user.setFirstName(signUpRequest.getFirstName());
        user.setMiddleName(signUpRequest.getMiddleName());
        user.setLastName(signUpRequest.getLastName());
        user.setDateOfBirth(DateUtils.parseDate(signUpRequest.getDateOfBirth()));
        user.setGender(Gender.valueOf(signUpRequest.getGender()));
        user.setAddress(new Address(signUpRequest.getStreetAndNumber(), signUpRequest.getCity(),
                signUpRequest.getState(), signUpRequest.getZipCode()));
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(signUpRequest.getPassword());
        user.setProvider(AuthProvider.local);

        if(signUpRequest.getEmail().endsWith("@sjsu.edu")) {
            user.setRole(Role.Admin);
        } else {
            user.setRole(Role.Patient);
        }
        user.setVerificationCode(RandomString.make(64));

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);

        EmailUtils.sendVerificationEmail(user, siteURL);

        return savedUser;
    }

    public Boolean verify(String verificationCode) {
        User user = userRepository.findByVerificationCode(verificationCode);
        if (null == user || user.getEmailVerified()) {
            return Boolean.FALSE;
        } else {
            user.setVerificationCode(null);
            user.setEmailVerified(Boolean.TRUE);
            userRepository.save(user);
            return Boolean.TRUE;
        }
    }

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Autowired
    public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }
}
