import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    const location = await prisma.location.findUnique({
      where: {
        locationId: id
      }
    });

    if (location) {

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