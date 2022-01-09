package edu.sjsu.cmpe275.vms.service;

import edu.sjsu.cmpe275.vms.model.User;
import edu.sjsu.cmpe275.vms.payload.SignUpRequest;

import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;

public interface AuthService {

    User registerUser(SignUpRequest signUpRequest, String siteURL) throws MessagingException, UnsupportedEncodingException;

    Boolean verify(String verificationCode);
}
