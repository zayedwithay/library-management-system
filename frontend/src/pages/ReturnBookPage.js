import React from 'react';
import ReturnForm from '../components/ReturnForm';
import { returnBook } from '../api/transactions';

function ReturnBookPage() {

    const handleReturnBook = async (returnData) => {
        try {
             const result = await returnBook(returnData);
             console.log("Book return result:", result);
             // Let form handle success message
         } catch (error) {
             console.error("Return book failed:", error);
             throw error; // Let form handle error message
         }
    };

    return (
        <div>
            {/* <h1>Return a Book</h1> */}
            <ReturnForm onSubmit={handleReturnBook} />
        </div>
    );
}

export default ReturnBookPage;
