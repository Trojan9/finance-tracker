import React from 'react';

import TransactionList from '../features/transactions/TransactionList';

const TransactionPage: React.FC = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">Transaction</h1>
            <TransactionList />
        </div>
    );
};

export default TransactionPage;
