import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';


const TransactionList: React.FC = () => {
    const { state, dispatch } = useAppContext();

    const addTransaction = () => {
        dispatch({
            type: 'SET_TRANSACTIONS',
            payload: [...state.transactions, { id: 1, name: 'New Transaction', amount: 100 }],
        });
    };

    return (
        <div>
            <h1>Transactions</h1>
            <ul>
                {state.transactions.map((transaction, index) => (
                    <li key={index}>{transaction.name}</li>
                ))}
            </ul>
            <button onClick={addTransaction}>Add Transaction</button>
        </div>
    );
};

export default TransactionList;
