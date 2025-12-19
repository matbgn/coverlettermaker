import { NextResponse } from 'next/server';
import pdf from 'pdf-parse';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume');

    if (!file) {
      return NextResponse.json({ error: 'Resume file is required' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Parse PDF
    const data = await pdf(buffer);
    const text = data.text;

    // Extract relevant information from resume
    // This is a simple extraction - you might want to enhance this with better parsing
    const profile = text
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 10000); // Limit to 10000 characters

    return NextResponse.json({
      profile: profile || 'No profile information extracted'
    });

  } catch (error) {
    console.error('Error parsing resume:', error);
    return NextResponse.json(
      { error: 'Failed to parse resume: ' + error.message },
      { status: 500 }
    );
  }
}

