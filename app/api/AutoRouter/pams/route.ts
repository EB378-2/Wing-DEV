// app/api/AutoRouter/pams/document/route.ts
import { NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename'); // ED_AD_2_EDTY_en.pdf

  try {
    if (!filename) {
      throw new Error('Filename parameter is required');
    }

    const token = await getAccessToken();
    
    // First get the document ID by querying the airport
    const airportResponse = await fetch(
      `https://api.autorouter.aero/v1.0/pams/airport/EDTY`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      }
    );

    const airportData = await airportResponse.json();
    console.log('Airport Data:', airportData);
    
    if (!airportResponse.ok) {
      throw new Error(airportData.message || 'Failed to fetch airport documents');
    }

    // Find the specific document by filename
    const allDocuments = [
      ...(airportData.Airport || []),
      ...(airportData.Arrival || []),
      ...(airportData.Departure || []),
      ...(airportData.Approach || []),
      ...(airportData.VFR || []),
    ];

    const document = allDocuments.find((doc: any) => doc.filename === filename);

    if (!document) {
      throw new Error(`Document ${filename} not found for EDTY`);
    }

    // Now fetch the actual PDF
    const pdfResponse = await fetch(
      `https://api.autorouter.aero/v1.0/pams/id/${document.docid}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/pdf',
        },
      }
    );

    if (!pdfResponse.ok) {
      throw new Error('Failed to fetch PDF document');
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}