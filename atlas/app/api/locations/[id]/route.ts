// app/admin/api/locations/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  context: any   
) {
  try {
    const locationId = context?.params?.id;

    if (!locationId) {
      return NextResponse.json({ error: 'Location ID missing' }, { status: 400 });
    }

    await prisma.location.delete({
      where: { id: locationId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting location:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
