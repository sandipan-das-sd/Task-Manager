package com.taskapp.taskmanager.service.impl;

import com.taskapp.taskmanager.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendPasswordResetEmail(String to, String resetLink) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject("Reset Your Password");
        message.setText("Click this link to reset your password:\n" + resetLink);

        try {
            mailSender.send(message);
        } catch (MailException ex) {
            logger.error("Password reset email failed for {}", to, ex);
            throw new RuntimeException("Password reset email could not be sent. Please try again later.");
        }
    }

    public  void sendEmail(String to,String subject,String body)
    {
        SimpleMailMessage message=new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        try {
            mailSender.send(message);
        } catch (MailException ex) {
            logger.warn("Notification email failed for {} with subject '{}'", to, subject, ex);
        }
    }
}
