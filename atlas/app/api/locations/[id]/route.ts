import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

interface Location {
  id: number;
  name: string;
  coordinates: [number, number];
  hours: string;
  status: string;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const jsonDirectory = path.join(process.cwd(), 'app', 'data');
    const fileContents = await fs.readFile(jsonDirectory + '/locations.json', 'utf8');
    const locations: Location[] = JSON.parse(fileContents);

    const id = parseInt(params.id);
    const location = locations.find((loc) => loc.id === id);

    if (location) {
      return NextResponse.json(location);
    } else {
      return NextResponse.json(
        { error: "location not found" },
        { status: 404 }
      );
    }
  }
  catch (error) {
    console.error('Failed to read locations.json:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}