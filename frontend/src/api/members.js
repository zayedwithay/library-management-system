import apiClient from './axiosConfig';

export const getMembers = async () => {
    try {
        const response = await apiClient.get('/members');
        return response.data;
    } catch (error) {
        console.error("Error fetching members:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

export const addMember = async (memberData) => {
    try {
        const response = await apiClient.post('/members', memberData);
        return response.data;
    } catch (error) {
        console.error("Error adding member:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

export const getMemberById = async (id) => {
    try {
        const response = await apiClient.get(`/members/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching member ${id}:`, error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

export const updateMember = async (id, memberData) => {
    try {
        const response = await apiClient.put(`/members/${id}`, memberData);
        return response.data;
    } catch (error) {
        console.error(`Error updating member ${id}:`, error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

export const payFine = async (memberId, paymentData) => {
     try {
        // paymentData might just be { amountPaid: number } or empty if paying full
        const response = await apiClient.post(`/members/${memberId}/payfine`, paymentData);
        return response.data;
    } catch (error) {
        console.error(`Error paying fine for member ${memberId}:`, error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

// Add other member API calls as needed
