package com.taskapp.taskmanager.service;

import com.taskapp.taskmanager.dto.ForgetPasswordRequest;
import com.taskapp.taskmanager.dto.ResetPasswordRequest;

public interface ForgotPasswordService {
String forgotPassword(ForgetPasswordRequest request);
String resetPassword(ResetPasswordRequest request);

}
