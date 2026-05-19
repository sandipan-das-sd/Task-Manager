package com.taskapp.taskmanager.service;

public interface EmailService {
void  sendPasswordResetEmail(String to,String resetLink);
void sendEmail(String to,String subject,String body);
}
