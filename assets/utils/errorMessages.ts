// utils/errorMessages.ts
interface ErrorMessages {
    [key: string]: {
      userMessage: string;
      logMessage: string;
    };
  }
  
  export const errorMessages: ErrorMessages = {
    // Authentication Errors
    AUTH_001: {
      userMessage: "Invalid email or password",
      logMessage: "Login failed - invalid credentials"
    },
    AUTH_002: {
      userMessage: "Email already registered",
      logMessage: "Registration failed - email exists"
    },
    AUTH_003: {
      userMessage: "ID already registered",
      logMessage: "Registration failed - ID exists"
    },
    AUTH_004: {
      userMessage: "Email not found",
      logMessage: "Password reset - email not found"
    },
    AUTH_005: {
      userMessage: "Invalid or expired token",
      logMessage: "Password reset - invalid token"
    },
    AUTH_006: {
      userMessage: "Token has expired",
      logMessage: "Password reset - expired token"
    },
    
    // Validation Errors
    VALID_001: {
      userMessage: "Password must be at least 8 characters",
      logMessage: "Validation failed - password too short"
    },
    VALID_002: {
      userMessage: "Email format is invalid",
      logMessage: "Validation failed - invalid email"
    },
    
    // System Errors
    SYS_001: {
      userMessage: "Service unavailable. Please try again later",
      logMessage: "API connection failed"
    },
    SYS_002: {
      userMessage: "Unexpected error occurred",
      logMessage: "Internal server error"
    }
  };
  
  export class AppError extends Error {
    code: string;
    userMessage: string;
    originalError?: Error;
  
    constructor(code: string, originalError?: Error) {
      const message = errorMessages[code]?.logMessage || "Unknown error occurred";
      super(message);
      
      this.code = code;
      this.userMessage = errorMessages[code]?.userMessage || "Something went wrong";
      this.originalError = originalError;
      
      if (originalError) {
        this.stack = originalError.stack;
      }
    }
  }
  
  export const handleError = (error: unknown): { code: string; userMessage: string } => {
    if (error instanceof AppError) {
      return { code: error.code, userMessage: error.userMessage };
    }
    
    if (error instanceof Error) {
      return { code: "SYS_002", userMessage: errorMessages.SYS_002.userMessage };
    }
    
    return { code: "SYS_002", userMessage: errorMessages.SYS_002.userMessage };
  };