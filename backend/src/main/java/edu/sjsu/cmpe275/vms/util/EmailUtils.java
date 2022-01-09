package edu.sjsu.cmpe275.vms.util;

import edu.sjsu.cmpe275.vms.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;

@Component
public class EmailUtils {

    private static final Logger logger = LoggerFactory.getLogger(EmailUtils.class);

    private static JavaMailSender mailSender;

    private JavaMailSender mailSenderInstance;

    @PostConstruct
    private void initStaticMailSender () {
        mailSender = this.mailSenderInstance;
    }

    public static void sendVerificationEmail(User user, String siteURL) throws MessagingException, UnsupportedEncodingException {
        String toAddress = user.getEmail();
        String fromAddress = "cmpe275.vms@gmail.com";
        String senderName = "Vaccination Management System";
        String subject = "Vaccination Management System : Email Verification";
        String content = "Hi [[name]],<br>"
                + "Please click the link below to verify your registration:<br>"
                + "<h4><a href=\"[[URL]]\" target=\"_self\">VERIFY</a></h4>"
                + "Thank you,<br>"
                + "Vaccination Management System.";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);

        content = content.replace("[[name]]", user.getFirstName());
        String verifyURL = siteURL + "/api/auth/verify?code=" + user.getVerificationCode();

        content = content.replace("[[URL]]", verifyURL);

        helper.setText(content, true);

        mailSender.send(message);
    }

    public static void sendNotificationEmail(User user, String status) {
        try {
            String toAddress = user.getEmail();
            String fromAddress = "cmpe275.vms@gmail.com";
            String senderName = "Vaccination Management System";
            String subject = "Vaccination Management System : Notification";
            String content = "Hi [[name]],<br>"
                    + "This is to inform you that your appointment has been " + status + ".<br>"
                    + "Thank you,<br>"
                    + "Vaccination Management System.";
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message);
            helper.setFrom(fromAddress, senderName);
            helper.setTo(toAddress);
            helper.setSubject(subject);
            content = content.replace("[[name]]", user.getFirstName());
            helper.setText(content, true);
            mailSender.send(message);
        } catch (MessagingException | UnsupportedEncodingException e) {
            logger.error("Exception in sending email: "+e.getLocalizedMessage());
        }
    }

    @Autowired
    public void setMailSender(JavaMailSender mailSender) {
        this.mailSenderInstance = mailSender;
    }
}
