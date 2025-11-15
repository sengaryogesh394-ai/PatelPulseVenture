import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

// POST /api/upload/image - Upload image to Cloudinary
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const folder = formData.get('folder') as string || 'team-members';
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (increase to 25MB)
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size too large. Maximum size is 25MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create unique public_id
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').split('.')[0];
    const publicId = `${originalName}_${timestamp}`;

    // Upload to Cloudinary
    const result = await uploadImageToCloudinary(buffer, {
      folder,
      public_id: publicId,
    });

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully to Cloudinary',
      imageUrl: result.url,
      publicId: result.public_id,
    });

  } catch (error: any) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload image', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/upload/image - Delete image from Cloudinary
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');
    
    if (!publicId) {
      return NextResponse.json(
        { success: false, error: 'No public ID provided' },
        { status: 400 }
      );
    }

    // Delete from Cloudinary
    await deleteImageFromCloudinary(publicId);

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully from Cloudinary',
    });

  } catch (error: any) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete image', details: error.message },
      { status: 500 }
    );
  }
}
