package com.sphere.user.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.sphere.user.exception.ApiException;
import com.sphere.user.exception.ErrorType;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

/**
 * Ports services/auth.services.js#sendEmail (the active Nodemailer/SMTP
 * path). The source also has a dormant Resend-based alternative
 * (sendEmailRsend) that no controller ever calls — not ported, since it's
 * dead code in the source (see docs/01-existing-system-analysis.md §13).
 */
@Service
@RequiredArgsConstructor
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${sphere.mail.from}")
    private String fromAddress;

    public void sendEmail(String toEmail, String subject, String htmlMessage) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setFrom(fromAddress);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlMessage, true);
            mailSender.send(message);
        } catch (MailException | jakarta.mail.MessagingException e) {
            log.error("Failed to send email to {}", toEmail, e);
            // Mirrors the generic 500 thrown by services/auth.services.js#sendEmail's catch block.
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, ErrorType.InternalServerError,
                    "Failed to send verification code on your email. Please try again later.");
        }
    }
}
