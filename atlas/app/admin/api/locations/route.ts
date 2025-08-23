// app/admin/api/locations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all locations
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const locations = await prisma.location.findMany({
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST new location
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, category, status, coordinates, hours } = body;

    // Generate a unique locationId
    const lastLocation = await prisma.location.findFirst({
      orderBy: { locationId: 'desc' }
    });
    const newLocationId = (lastLocation?.locationId || 0) + 1;

    const location = await prisma.location.create({
      data: {
        locationId: newLocationId,
        name,
        coordinates: coordinates || [0, 0],
        hours: hours || 'N/A',
        status: status || 'OPEN'
      }
    });

    return NextResponse.json(location);
  } catch (error) {
    console.error('Error creating location:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}