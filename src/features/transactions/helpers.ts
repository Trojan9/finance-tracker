export const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US');
};

export const calculateTotal = (amounts: number[]): number => {
    return amounts.reduce((acc, val) => acc + val, 0);
};
