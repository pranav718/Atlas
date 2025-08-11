import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET(request) {
  const jsonDirectory = path.join(process.cwd(), 'data');
  const fileContents = await fs.readFile(jsonDirectory + '/locations.json', 'utf8');
  const locations = JSON.parse(fileContents);

  return NextResponse.json(locations);
}