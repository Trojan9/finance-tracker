import { ReactNode } from "react";

export interface Props {
    children?: ReactNode
    // any props that come into the component
  }

  // Define types for transactions and categories
  export type Transaction = {
    date: string;
    amount: number;
    category?: string;
    type: string;
  };
  
  export type CategorySpending = {
    category: string;
    amount: number;
  };

  export const categoryOptions = [
    "Groceries",
    "Dining & Takeaway",
    "Transport",
    "Entertainment",
    "Bills & Utilities",
    "Shopping",
    "Healthcare",
    "Education",
    "Savings & Investments",
    "Other",
  ];
