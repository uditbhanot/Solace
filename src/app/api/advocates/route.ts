import { NextRequest } from 'next/server';
import { advocateData } from "../../../db/seed/advocates";

// Type for API parameters
type SearchParams = {
  search?: string;
  page: number;
  limit: number;
  sortBy: 'name' | 'experience' | 'location';
  sortOrder: 'asc' | 'desc';
};

// Type for the advocate data
interface Advocate {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
  state?: string;
}

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params: SearchParams = {
      search: searchParams.get('search') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: Math.min(parseInt(searchParams.get('limit') || '10'), 100),
      sortBy: (searchParams.get('sortBy') as 'name' | 'experience' | 'location') || 'name',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc',
    };

    // Calculate pagination values
    const offset = (params.page - 1) * params.limit;

    // Use mock data directly
    let data = [...advocateData];

    // Apply search filter if provided
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      data = data.filter((advocate: Advocate) => {
        const fullName = `${advocate.firstName} ${advocate.lastName}`.toLowerCase();
        return (
          fullName.includes(searchTerm) ||
          advocate.city.toLowerCase().includes(searchTerm) ||
          advocate.specialties.some(specialty =>
            specialty.toLowerCase().includes(searchTerm)
          )
        );
      });
    }

    // Apply sorting
    switch (params.sortBy) {
      case 'name':
        data.sort((a: Advocate, b: Advocate) => {
          const nameA = `${a.firstName} ${a.lastName}`;
          const nameB = `${b.firstName} ${b.lastName}`;
          return params.sortOrder === 'asc'
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        });
        break;
      case 'experience':
        data.sort((a: Advocate, b: Advocate) => {
          return params.sortOrder === 'asc'
            ? a.yearsOfExperience - b.yearsOfExperience
            : b.yearsOfExperience - a.yearsOfExperience;
        });
        break;
      case 'location':
        data.sort((a: Advocate, b: Advocate) => {
          return params.sortOrder === 'asc'
            ? a.city.localeCompare(b.city)
            : b.city.localeCompare(a.city);
        });
        break;
    }

    // Get total count for pagination
    const totalItems = data.length;

    // Apply pagination
    data = data.slice(offset, offset + params.limit);

    const totalPages = Math.ceil(totalItems / params.limit);

    const headers = new Headers();
    headers.append('Cache-Control', 'public, max-age=60');

    return Response.json({
      data,
      pagination: {
        page: params.page,
        limit: params.limit,
        totalItems,
        totalPages
      }
    }, {
      status: 200,
      headers: headers,
      statusText: 'OK'
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch advocates', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
