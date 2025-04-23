import apiClient from './axiosConfig'; // Use central config

export const getBooks = async () => {
    try {
        const response = await apiClient.get('/books');
        return response.data;
    } catch (error) {
        console.error("Error fetching books:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

export const getBookById = async (id) => {
    try {
        const response = await apiClient.get(`/books/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching book ${id}:`, error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

export const addBook = async (bookData) => {
     // Auth headers handled by interceptor if configured in axiosConfig.js
    try {
        const response = await apiClient.post('/books', bookData);
        return response.data;
    } catch (error) {
        console.error("Error adding book:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

export const updateBook = async (id, bookData) => {
    try {
        const response = await apiClient.put(`/books/${id}`, bookData);
        return response.data;
    } catch (error) {
        console.error(`Error updating book ${id}:`, error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

export const deleteBook = async (id) => {
    try {
        const response = await apiClient.delete(`/books/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting book ${id}:`, error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

export const checkAvailability = async (id) => {
    try {
        const response = await apiClient.get(`/books/availability/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error checking availability for book ${id}:`, error.response?.data || error.message);
        throw error.response?.data || error;
    }
};
