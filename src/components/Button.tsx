import React from 'react';

interface ButtonProps {
    label: string;
    onClick: () => void;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, type = 'button', className = '' }) => {
    return (
        <button
            type={type}
            className={`bg-blue-500 text-white px-4 py-2 rounded ${className}`}
            onClick={onClick}
        >
            {label}
        </button>
    );
};

export default Button;
