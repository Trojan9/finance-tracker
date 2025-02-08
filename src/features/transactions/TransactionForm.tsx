import React, { useState } from 'react';

interface TransactionFormProps {
    onSubmit: (transaction: { name: string; amount: number }) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState<number | ''>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && amount) {
            onSubmit({ name, amount: Number(amount) });
            setName('');
            setAmount('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium">Transaction Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                />
            </div>
            <div>
                <label className="block text-sm font-medium">Amount</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.valueAsNumber || '')}
                    className="border rounded px-2 py-1 w-full"
                />
            </div>
            <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded"
            >
                Add Transaction
            </button>
        </form>
    );
};

export default TransactionForm; // Ensure the component is exported
