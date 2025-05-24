import { Alert } from 'react-native';

const API_BASE_URL = 'https://sheetdb.io/api/v1/mm8jpgiaq7bqt';

interface UserData {
  id: string;
  Email: string;  // Required
  Username?: string;
  Company?: string;
  Password?: string;
  AccessCode?: string;
  ResetToken?: string;
  ResetTokenExpiry?: string;
  CreatedAt?: string;  // Added this
  [key: string]: any;  // For any additional fields
}

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export const authService = {
  // ==================== CRUD OPERATIONS ====================

  // CREATE - Create a new user
  async createUser(userData: Omit<UserData, 'id'> & { Id: string }): Promise<UserData> {
    try {
      // Validate required fields
      if (!userData.Email || !userData.Password || !userData.Id) {
        throw new Error('Missing required fields');
      }
  
      // Check if email already exists
      const emailExists = await this.checkEmailExists(userData.Email);
      if (emailExists) {
        throw new Error('Email already registered');
      }
  
      // Check if ID already exists
      const idExists = await this.checkIdExists(userData.Id);
      if (idExists) {
        throw new Error('ID already registered');
      }
  
      const newUser: UserData = {
        id: '', // Temporary empty string
        Email: userData.Email, // Explicitly include required Email
        ...userData, // Spread the rest of userData
        AccessCode: this.generateRandomToken(),
        CreatedAt: new Date().toISOString(),
      };
  
      const response = await fetch(`${API_BASE_URL}?sheet=UserData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ data: [newUser] }),
      });
  
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'User creation failed');
      }
  
      // Ensure all required fields are present in the returned user
      const createdUser: UserData = {
        ...newUser,
        id: responseData.data[0].id,
        Email: newUser.Email, // Explicitly include required fields
      };
  
      return createdUser;
    } catch (error) {
      console.error('User creation error:', error);
      throw this.normalizeError(error);
    }
  },

  // READ - Get user by email
  async getUserByEmail(email: string): Promise<UserData | null> {
    try {
      if (!email) throw new Error('Email is required');
      
      const response = await fetch(
        `${API_BASE_URL}/search?sheet=UserData&Email=${encodeURIComponent(email)}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const data = await response.json();
      return data.length > 0 ? this.normalizeUserData(data[0]) : null;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw this.normalizeError(error);
    }
  },

  // READ - Get all users
  async getAllUsers(): Promise<UserData[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?sheet=UserData`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      return Array.isArray(data) ? data.map(user => this.normalizeUserData(user)) : [];
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw this.normalizeError(error);
    }
  },

  // UPDATE - Update user by email
  async updateUser(email: string, updateData: Partial<UserData>): Promise<UserData> {
    try {
      if (!email) throw new Error('Email is required');
      
      // First check if user exists
      const userExists = await this.checkEmailExists(email);
      if (!userExists) {
        throw new Error('User not found');
      }

      const response = await fetch(
        `${API_BASE_URL}/Email/${encodeURIComponent(email)}?sheet=UserData`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ data: updateData }),
        }
      );

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'User update failed');
      }

      return this.normalizeUserData(responseData.data);
    } catch (error) {
      console.error('User update error:', error);
      throw this.normalizeError(error);
    }
  },

  // DELETE - Delete user by email
  async deleteUser(email: string): Promise<boolean> {
    try {
      if (!email) throw new Error('Email is required');
      
      // First check if user exists
      const userExists = await this.checkEmailExists(email);
      if (!userExists) {
        throw new Error('User not found');
      }

      const response = await fetch(
        `${API_BASE_URL}/Email/${encodeURIComponent(email)}?sheet=UserData`,
        {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('User deletion failed');
      }

      return true;
    } catch (error) {
      console.error('User deletion error:', error);
      throw this.normalizeError(error);
    }
  },

  // ==================== AUTHENTICATION METHODS ====================

  async login(email: string, password: string): Promise<UserData> {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const response = await fetch(
        `${API_BASE_URL}/search?sheet=UserData&Email=${encodeURIComponent(email)}&Password=${encodeURIComponent(password)}`
      );
      
      const data = await response.json();

      if (!response.ok || data.length === 0) {
        throw new Error(data.message || 'Invalid email or password');
      }

      return this.normalizeUserData(data[0]);
    } catch (error) {
      console.error('Login error:', error);
      throw this.normalizeError(error);
    }
  },

  register: async function(userData: Omit<UserData, 'id'> & { Id: string }): Promise<UserData> {
    return this.createUser(userData);
  },

  async requestPasswordReset(email: string): Promise<{ token: string }> {
    try {
      const user = await this.getUserByEmail(email);
      if (!user) {
        throw new Error('Email not found');
      }

      const resetToken = this.generateRandomToken();
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      await this.updateUser(email, {
        ResetToken: resetToken,
        ResetTokenExpiry: expiryDate.toISOString(),
      });

      return { token: resetToken };
    } catch (error) {
      console.error('Password reset error:', error);
      throw this.normalizeError(error);
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/search?sheet=UserData&ResetToken=${encodeURIComponent(token)}`
      );
      
      const data = await response.json();

      if (!response.ok || data.length === 0) {
        throw new Error('Invalid or expired token');
      }

      const user = data[0];
      const expiryDate = new Date(user.ResetTokenExpiry);

      if (expiryDate < new Date()) {
        throw new Error('Token has expired');
      }

      await this.updateUser(user.Email, {
        Password: newPassword,
        ResetToken: '',
        ResetTokenExpiry: '',
        AccessCode: this.generateRandomToken(),
      });
    } catch (error) {
      console.error('Password update error:', error);
      throw this.normalizeError(error);
    }
  },

  async validateSession(accessCode: string): Promise<UserData | null> {
    try {
      if (!accessCode) return null;
      
      const response = await fetch(
        `${API_BASE_URL}/search?sheet=UserData&AccessCode=${encodeURIComponent(accessCode)}`
      );
      
      const data = await response.json();
      return data.length > 0 ? this.normalizeUserData(data[0]) : null;
    } catch (error) {
      console.error('Session validation error:', error);
      return null;
    }
  },

  // ==================== UTILITY METHODS ====================

  async checkEmailExists(email: string): Promise<boolean> {
    const user = await this.getUserByEmail(email);
    return !!user;
  },

  async checkIdExists(id: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/search?sheet=UserData&Id=${encodeURIComponent(id)}`
      );
      
      const data = await response.json();
      return data.length > 0;
    } catch (error) {
      console.error('Error checking ID:', error);
      return false;
    }
  },

  generateRandomToken(): string {
    return (
      Math.random().toString(36).slice(2, 15) +
      Math.random().toString(36).slice(2, 15)
    );
  },

  // Normalize user data to handle special cases (like the "   " field)
  normalizeUserData(userData: any): UserData {
    return {
      ...userData,
      Username: userData["   "] || userData.Username,
      id: userData.Id || userData.id,
    };
  },

  // Standardize error handling
  normalizeError(error: any): Error {
    if (error instanceof Error) return error;
    if (typeof error === 'string') return new Error(error);
    return new Error('An unknown error occurred');
  },
};

