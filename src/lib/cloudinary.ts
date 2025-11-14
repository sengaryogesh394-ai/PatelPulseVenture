import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Get optimized transformations based on content type
const getTransformations = (folder: string) => {
  switch (folder) {
    case 'team-members':
      return [
        { width: 800, height: 800, crop: 'fill', gravity: 'face', quality: '95' },
        { fetch_format: 'auto' }
      ];
    case 'projects':
      return [
        { width: 1200, height: 800, crop: 'fill', quality: '90' },
        { fetch_format: 'auto' }
      ];
    case 'services':
      return [
        { width: 1000, height: 600, crop: 'fill', quality: '90' },
        { fetch_format: 'auto' }
      ];
    case 'blog':
      return [
        { width: 1200, height: 630, crop: 'fill', quality: '90' },
        { fetch_format: 'auto' }
      ];
    default:
      return [
        { width: 1200, height: 1200, crop: 'limit', quality: '90' },
        { fetch_format: 'auto' }
      ];
  }
};

// Server-side upload function
export const uploadImageToCloudinary = async (
  imageBuffer: Buffer,
  options: {
    folder?: string;
    public_id?: string;
    transformation?: any;
  } = {}
): Promise<{ url: string; public_id: string }> => {
  try {
    const folder = options.folder || 'team-members';
    const transformations = options.transformation || getTransformations(folder);
    
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: options.public_id,
          transformation: transformations,
          quality: 'auto:good', // Use good quality as baseline
          ...options,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(imageBuffer);
    });

    const uploadResult = result as any;
    return {
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

// Generate optimized URL for existing Cloudinary image
export const getOptimizedImageUrl = (
  publicId: string, 
  options: {
    width?: number;
    height?: number;
    quality?: string;
    crop?: string;
    gravity?: string;
  } = {}
): string => {
  const {
    width = 1200,
    height = 800,
    quality = '90',
    crop = 'fill',
    gravity = 'auto'
  } = options;

  return cloudinary.url(publicId, {
    width,
    height,
    crop,
    gravity,
    quality,
    fetch_format: 'auto',
    secure: true
  });
};

// Delete image from Cloudinary
export const deleteImageFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    // Don't throw error for delete failures, just log them
  }
};
