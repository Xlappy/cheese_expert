import { Cheese } from '../types';

const API_BASE_URL = 'http://localhost:3003/api';

/**
 * API Service for Cheese Expert System
 * Handles all communication with the backend server
 */
export class CheeseAPI {
    /**
     * Fetch all cheeses from the database
     */
    static async getAllCheeses(): Promise<Cheese[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/cheeses`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching cheeses:', error);
            throw new Error('Failed to load cheeses from database. Please ensure the server is running.');
        }
    }

    /**
     * Fetch a single cheese by ID
     */
    static async getCheeseById(id: string): Promise<Cheese> {
        try {
            const response = await fetch(`${API_BASE_URL}/cheeses/${id}`);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Cheese not found');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching cheese:', error);
            throw error;
        }
    }

    /**
     * Add a new cheese to the database
     */
    static async addCheese(cheese: Cheese): Promise<{ success: boolean; id: string }> {
        try {
            const response = await fetch(`${API_BASE_URL}/cheeses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cheese),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error adding cheese:', error);
            throw error;
        }
    }

    /**
     * Update an existing cheese
     */
    static async updateCheese(id: string, cheese: Cheese): Promise<{ success: boolean }> {
        try {
            const response = await fetch(`${API_BASE_URL}/cheeses/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cheese),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating cheese:', error);
            throw error;
        }
    }

    /**
     * Delete a cheese from the database
     */
    static async deleteCheese(id: string): Promise<{ success: boolean }> {
        try {
            const response = await fetch(`${API_BASE_URL}/cheeses/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error deleting cheese:', error);
            throw error;
        }
    }

    /**
     * Search cheeses by query string
     */
    static async searchCheeses(query: string): Promise<Cheese[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error searching cheeses:', error);
            throw error;
        }
    }

    /**
     * Check server health
     */
    static async checkHealth(): Promise<{ status: string; cheeseCount: number }> {
        try {
            const response = await fetch(`${API_BASE_URL}/health`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error checking server health:', error);
            throw new Error('Server is not responding');
        }
    }
}
