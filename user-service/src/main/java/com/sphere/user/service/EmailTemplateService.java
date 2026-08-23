package com.sphere.user.service;

import org.springframework.stereotype.Service;

/** Ports utils/emailTemplate.js's two template functions. Simple inline HTML, matching the source's approach (no template engine in the Node app either). */
@Service
public class EmailTemplateService {

    public String verificationCodeTemplate(String verificationCode) {
        return """
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
                    <h2>Your Sphere verification code</h2>
                    <p>Use the code below to verify your account. It expires in 10 minutes.</p>
                    <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px;">%s</p>
                    <p>If you did not request this, you can safely ignore this email.</p>
                </div>
                """.formatted(verificationCode);
    }

    public String resetPasswordTemplate(String resetPasswordUrl) {
        return """
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
                    <h2>Reset your Sphere password</h2>
                    <p>Click the link below to reset your password. It expires in 10 minutes.</p>
                    <p><a href="%s">%s</a></p>
                    <p>If you did not request this, you can safely ignore this email.</p>
                </div>
                """.formatted(resetPasswordUrl, resetPasswordUrl);
    }
}
