import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      orderBy: {
        locationId: 'asc'
      }
    });

    const formattedLocations = locations.map(loc => ({
      id: loc.locationId,
      name: loc.name,
      coordinates: loc.coordinates,
      hours: loc.hours,
      status: loc.status
    }));

    return NextResponse.json(formattedLocations);
  } catch (error) {
    console.error("Failed to fetch locations from database", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}