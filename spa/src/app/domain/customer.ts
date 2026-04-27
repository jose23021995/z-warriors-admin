export interface Country {
    name?: string;
    code?: string;
}

export interface Representative {
    name?: string;
    image?: string;
}

export interface Customer {
    id?: number;
    name?: string;
    country?: Country;
    date?: string | Date;
    balance?: number;
    company?: string;
    status?: string;
    activity?: number;
    representative?: Representative;
    verified?: boolean;
}
