import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }  // Note: params is now a Promise
) {
  try {
    const { id } = await params;  // Await the params
    const locationId = parseInt(id);
    
    const location = await prisma.location.findUnique({
      where: {
        locationId: locationId
      }
    });

    if (location) {
      // Transform to match existing format
      const formattedLocation = {
        id: location.locationId,
        name: location.name,
        coordinates: location.coordinates,
        hours: location.hours,
        status: location.status
      };
      
      return NextResponse.json(formattedLocation);
    } else {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Failed to fetch location from database:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}