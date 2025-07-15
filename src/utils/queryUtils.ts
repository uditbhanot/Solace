export type SortDirection = 'asc' | 'desc';
export type SortKey = 'name' | 'experience' | 'location';

export interface PaginationConfig {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}

export interface SortConfig {
    key: SortKey;
    direction: SortDirection;
}

export interface QueryParams {
    page?: number;
    limit?: number;
    sortBy?: SortKey;
    sortOrder?: SortDirection;
    search?: string;
}

export function buildQuery(params: QueryParams): string {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
    if (params.search) searchParams.set('search', params.search);

    return searchParams.toString();
}

export function formatExperience(years: number): string {
    if (years === 0) return 'New to the field';
    if (years === 1) return '1 year';
    return `${years} years`;
}

export function validatePagination(page: number, limit: number): boolean {
    return page > 0 && limit > 0;
}
