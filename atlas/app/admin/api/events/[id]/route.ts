import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add this to prevent static generation
export const dynamic = 'force-dynamic';

// DELETE event - Updated parameter structure
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await the params since it's now a Promise
    const { id: eventId } = await params;

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID missing' }, { status: 400 });
    }

    await prisma.event.delete({
      where: { id: eventId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}