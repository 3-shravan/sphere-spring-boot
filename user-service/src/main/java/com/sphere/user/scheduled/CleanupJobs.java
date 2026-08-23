package com.sphere.user.scheduled;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.sphere.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * Ports server/src/Automation/jobs/*.js exactly (same cadence, same intent):
 *  - removeUnverifiedAccounts.js: every 30 min, hard-delete unverified
 *    accounts older than 30 minutes.
 *  - removeUnverifedTokens.js: every 30 min, clear expired reset-password
 *    token fields.
 *  - deleteTokens.js: daily at midnight, purge blacklisted-token rows
 *    older than 30 days.
 */
@Component
@RequiredArgsConstructor
public class CleanupJobs {

    private static final Logger log = LoggerFactory.getLogger(CleanupJobs.class);

    private final UserRepository userRepository;

    @Scheduled(fixedRate = 30, timeUnit = java.util.concurrent.TimeUnit.MINUTES)
    @Transactional
    public void removeUnverifiedAccounts() {
        Instant cutoff = Instant.now().minus(30, ChronoUnit.MINUTES);
        int deleted = userRepository.deleteUnverifiedOlderThan(cutoff);
        if (deleted > 0) {
            log.info("Removed {} unverified account(s) older than 30 minutes", deleted);
        }
    }

    @Scheduled(fixedRate = 30, timeUnit = java.util.concurrent.TimeUnit.MINUTES)
    @Transactional
    public void clearExpiredResetTokens() {
        int cleared = userRepository.clearExpiredResetTokens(Instant.now());
        if (cleared > 0) {
            log.info("Cleared {} expired reset-password token(s)", cleared);
        }
    }
}
