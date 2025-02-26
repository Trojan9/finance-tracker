export const formatCurrency = (value: number): string => {
    return `$${value.toFixed(2)}`;
};

export const getAbbreviation = (fullName: string) => {
    return fullName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  };
