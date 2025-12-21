import { NextRequest, NextResponse } from 'next/server';

// TODO: Replace with actual file storage (AWS S3, Cloudinary, etc.) in production
// For alpha version, we'll use a simple structure

interface MovieDocument {
  id: string;
  movieId: string;
  type: 'contract' | 'financial' | 'legal' | 'production' | 'other';
  title: string;
  description?: string;
  fileUrl: string;
  uploadedAt: Date;
  uploadedBy: string;
}

let documentsData: MovieDocument[] = [];

// GET - Get all documents for a movie
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const documents = documentsData.filter(doc => doc.movieId === id);

  return NextResponse.json({
    success: true,
    data: documents,
    total: documents.length,
  });
}

// POST - Upload a document for a movie
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.type || !body.title || !body.fileUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: type, title, fileUrl' },
        { status: 400 }
      );
    }

    const newDocument: MovieDocument = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      movieId: id,
      type: body.type,
      title: body.title,
      description: body.description || '',
      fileUrl: body.fileUrl,
      uploadedAt: new Date(),
      uploadedBy: body.uploadedBy || 'admin',
    };

    documentsData.push(newDocument);

    return NextResponse.json({
      success: true,
      data: newDocument,
      message: 'Document uploaded successfully',
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to upload document' },
      { status: 500 }
    );
  }
}
