import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET(request) {
  // Find the absolute path of the data directory
  const jsonDirectory = path.join(process.cwd(), 'data');
  
  // Read the json data file
  const fileContents = await fs.readFile(jsonDirectory + '/locations.json', 'utf8');
  
  // Parse the file contents into a JavaScript array
  const locations = JSON.parse(fileContents);
  
  // Return the entire array as a JSON response
  return NextResponse.json(locations);
}