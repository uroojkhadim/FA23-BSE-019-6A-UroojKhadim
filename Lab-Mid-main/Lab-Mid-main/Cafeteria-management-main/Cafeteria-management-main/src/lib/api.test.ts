import { describe, it, expect, beforeEach, vi, beforeAll } from 'vitest';
import { authAPI, menuAPI } from '../lib/api';

// Mock fetch for testing
beforeAll(() => {
  global.fetch = vi.fn() as any;
});

describe('API Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication API', () => {
    it('should login successfully with valid credentials', async () => {
      const mockResponse = {
        _id: 'test-user-123',
        email: 'student@comsats.edu.pk',
        fullName: 'Test Student',
        role: 'student',
        token: 'mock-jwt-token',
      };

      (fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await authAPI.login('student@comsats.edu.pk', 'password123', 'student');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'student@comsats.edu.pk',
            password: 'password123',
            role: 'student',
          }),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it('should fail login with invalid credentials', async () => {
      (fetch as any).mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid email or password' }),
      });

      await expect(
        authAPI.login('wrong@email.com', 'wrongpass', 'student')
      ).rejects.toThrow('Invalid email or password');
    });
  });

  describe('Menu API', () => {
    it('should fetch all menu items', async () => {
      const mockMenuItems = [
        {
          _id: 'menu-1',
          itemName: 'Chicken Biryani',
          itemPrice: 5.99,
          category: 'Lunch',
          isAvailable: true,
        },
      ];

      (fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          items: mockMenuItems,
          totalCount: 1,
          hasNext: false,
        }),
      });

      const result = await menuAPI.getAll();

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/menuitems',
        expect.anything()
      );

      expect(result.items).toHaveLength(1);
      expect(result.items[0].itemName).toBe('Chicken Biryani');
    });

    it('should fetch single menu item by ID', async () => {
      const mockItem = {
        _id: 'menu-1',
        itemName: 'Chicken Biryani',
        itemPrice: 5.99,
      };

      (fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockItem),
      });

      const result = await menuAPI.getById('menu-1');

      expect(result).toEqual(mockItem);
    });
  });
});
