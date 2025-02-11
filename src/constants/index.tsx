import { ReactNode } from "react";

export interface Props {
    children?: ReactNode
    // any props that come into the component
  }

  // Define types for transactions and categories
  export type Transaction = {
    date: string;
    amount: number;
  };
  
  export type CategorySpending = {
    category: string;
    amount: number;
  };
