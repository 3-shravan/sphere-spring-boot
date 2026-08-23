package com.sphere.post.exception;

import org.springframework.http.HttpStatus;

/**
 * Used for the "not the comment author" case — DEVIATION from source per
 * your instruction to fix obvious status-code bugs: the Node source coded
 * this as 400 BadRequest ("You are not authorized to delete this comment"),
 * which is semantically a 403. Fixed here and logged in
 * docs/decisions/DECISIONS_REQUIRED.md #7 as an intentional, documented change.
 */
public class ForbiddenException extends ApiException {
    public ForbiddenException(String message) { super(HttpStatus.FORBIDDEN, ErrorType.Forbidden, message); }
}
