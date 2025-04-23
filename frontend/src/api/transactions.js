import apiClient from './axiosConfig';

export const issueBook = async (issueData) => {
    // issueData = { bookId, memberId, issueDate?, dueDate? }
    try {
        const response = await apiClient.post('/transactions/issue', issueData);
        return response.data;
    } catch (error) {
        console.error("Error issuing book:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

export const returnBook = async (returnData) => {
    // returnData = { transactionId, returnDate?, payFineNow? }
    try {
        const response = await apiClient.post('/transactions/return', returnData);
        return response.data;
    } catch (error) {
        console.error("Error returning book:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

export const getTransactions = async (/*queryParams = {}*/) => {
    try {
        // const response = await apiClient.get('/transactions', { params: queryParams });
        const response = await apiClient.get('/transactions');
        return response.data;
    } catch (error) {
        console.error("Error fetching transactions:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};
