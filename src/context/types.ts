export interface Transaction {
    id: number;
    name: string;
    amount: number;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
