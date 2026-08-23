package com.sphere.user.entity;

/**
 * Enum constants intentionally match the exact casing used by the Node
 * source ("Male" | "Female" | "Other") and by the existing React frontend,
 * so JSON serialization requires no custom naming strategy to stay
 * wire-compatible.
 */
public enum Gender {
    Male,
    Female,
    Other
}
