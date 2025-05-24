// services/authService.ts
import { Alert } from "react-native";
import { errorMessages, AppError, handleError } from "../utils/errorMessages";
const API_BASE_URL = "https://sheetdb.io/api/v1/mm8jpgiaq7bqt";

interface UserData {
  Username?: string;
  Email?: string;
  Id?: string;
  Company?: string;
  Password?: string;
  AccessCode?: string;
  ResetToken?: string;
  ResetTokenExpiry?: string;
}

export const authService = {
  /**
   * User Login
   * @param email User email
   * @param password User password
   * @returns User data if successful
   */
  async login(email: string, password: string): Promise<UserData | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/search?sheet=UserData&Email=${encodeURIComponent(email)}&Password=${encodeURIComponent(password)}`
      );
      const data = await response.json();
      
      if (data.length === 0) {
        throw new Error("Invalid email or password");
      }
      
      return data[0];
    } catch (error) {
      const { code, userMessage } = handleError(error);
      console.error(`[${code}] ${errorMessages[code]?.logMessage}`, error);
      throw new AppError(code, error instanceof Error ? error : undefined);
    }
  },

  /**
   * User Registration
   * @param userData User registration data
   * @returns Created user data
   */
  async register(userData: UserData): Promise<UserData> {
    try {
      // Check if email already exists
      const emailCheck = await fetch(
        `${API_BASE_URL}/search?sheet=UserData&Email=${encodeURIComponent(userData.Email || '')}`
      );
      const emailData = await emailCheck.json();
      
      if (emailData.length > 0) {
        throw new Error("Email already registered");
      }

      // Check if ID already exists
      if (userData.Id) {
        const idCheck = await fetch(
          `${API_BASE_URL}/search?sheet=UserData&Id=${encodeURIComponent(userData.Id)}`
        );
        const idData = await idCheck.json();
        
        if (idData.length > 0) {
          throw new Error("ID already registered");
        }
      }

      // Generate access code
      const accessCode = this.generateRandomToken();
      
      const newUser = {
        ...userData,
        AccessCode: accessCode,
        CreatedAt: new Date().toISOString()
      };

      const response = await fetch(`${API_BASE_URL}?sheet=UserData`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: [newUser] }),
      });

      return await response.json();
    } catch (error) {
      const { code, userMessage } = handleError(error);
      console.error(`[${code}] ${errorMessages[code]?.logMessage}`, error);
      throw new AppError(code, error instanceof Error ? error : undefined);
    }
  },

  /**
   * Initiate password reset process
   * @param email User email
   * @returns Reset token (in production, this would be sent via email)
   */
  async requestPasswordReset(email: string): Promise<{ token: string; message: string }> {
    try {
      // Check if email exists
      const response = await fetch(
        `${API_BASE_URL}/search?sheet=UserData&Email=${encodeURIComponent(email)}`
      );
      const data = await response.json();
      
      if (data.length === 0) {
        throw new Error("Email not found");
      }

      const user = data[0];
      const resetToken = this.generateRandomToken();
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1); // 1 hour expiry

      // Update user with reset token (in a real app, you would send an email)
      await fetch(
        `${API_BASE_URL}/Email/${encodeURIComponent(email)}?sheet=UserData`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: { 
              ResetToken: resetToken,
              ResetTokenExpiry: expiryDate.toISOString()
            }
          }),
        }
      );

      return {
        token: resetToken,
        message: "Reset instructions sent to your email"
      };
    } catch (error) {
      const { code, userMessage } = handleError(error);
      console.error(`[${code}] ${errorMessages[code]?.logMessage}`, error);
      throw new AppError(code, error instanceof Error ? error : undefined);
    }
  },

  /**
   * Complete password reset process
   * @param token Reset token
   * @param newPassword New password
   * @returns Success message
   */
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    try {
      // Verify token exists and isn't expired
      const response = await fetch(
        `${API_BASE_URL}/search?sheet=UserData&ResetToken=${encodeURIComponent(token)}`
      );
      const data = await response.json();

      if (data.length === 0) {
        throw new Error("Invalid or expired token");
      }

      const user = data[0];
      const expiryDate = new Date(user.ResetTokenExpiry);
      
      if (expiryDate < new Date()) {
        throw new Error("Token has expired");
      }

      // Update password and clear reset token
      await fetch(
        `${API_BASE_URL}/Email/${encodeURIComponent(user.Email)}?sheet=UserData`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: { 
              Password: newPassword,
              ResetToken: "",
              ResetTokenExpiry: "",
              AccessCode: this.generateRandomToken() // Generate new access code
            }
          }),
        }
      );

      return { message: "Password reset successfully" };
    } catch (error) {
      const { code, userMessage } = handleError(error);
      console.error(`[${code}] ${errorMessages[code]?.logMessage}`, error);
      throw new AppError(code, error instanceof Error ? error : undefined);
    }
  },

  /**
   * Check if client ID exists
   * @param id Client ID to check
   * @returns Client data if exists
   */
  async checkClientId(id: string): Promise<any> {
    try {
      const cleanId = id.replace(/[^a-zA-Z]/g, "");
      const response = await fetch(
        `${API_BASE_URL}/search?sheet=Clients&id=${encodeURIComponent(cleanId)}`
      );
      return await response.json();
    } catch (error) {
      console.error("Client ID check error:", error);
      throw error;
    }
  },

  /**
   * Generate a random token
   * @returns Random token string
   */
  generateRandomToken(): string {
    return Math.random().toString(36).slice(2) + 
           Math.random().toString(36).slice(2) +
           Math.random().toString(36).slice(2);
  },

  /**
   * Validate user session
   * @param accessCode User's access code
   * @returns User data if valid
   */
  async validateSession(accessCode: string): Promise<UserData | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/search?sheet=UserData&AccessCode=${encodeURIComponent(accessCode)}`
      );
      const data = await response.json();
      return data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error("Session validation error:", error);
      return null;
    }
  }
};