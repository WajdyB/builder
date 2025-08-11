# Image Handling in CMS-Builder

## Overview

This document explains how user profile images are handled in the CMS-Builder application to avoid HTTP response header size issues.

## Problem Solved

Previously, user images were stored as base64 data URIs in the database, which caused:
- `net::ERR_RESPONSE_HEADERS_TOO_BIG` errors
- Large HTTP response headers
- Performance issues
- Database bloat

## New Solution

### 1. File-Based Storage
- Images are stored as files in `public/uploads/avatars/`
- Database only stores the file path (e.g., `/uploads/avatars/avatar_user123_1234567890.jpg`)
- Next.js serves images directly as static files

### 2. File Naming Convention
```
avatar_{userId}_{timestamp}.{extension}
```
Example: `avatar_abc123_1703123456789.jpg`

### 3. Security Features
- Only authenticated users can upload images
- Filename validation ensures users can only access their own images
- File type and size validation (max 5MB)

## Implementation Details

### API Endpoints
- `POST /api/user/upload-avatar` - Upload new avatar
- `GET /api/user/profile` - Get user profile (no large image data)

### Database Schema
```prisma
model User {
  id    String  @id @default(cuid())
  name  String?
  email String  @unique
  image String? // Now stores file path, not base64 data
  // ... other fields
}
```

### Frontend Usage
```tsx
// Utility function to handle image URLs safely
const getImageUrl = (imagePath: string | null | undefined): string | undefined => {
  if (!imagePath) return undefined
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) return imagePath
  
  // If it's a data URI (base64), return undefined to avoid header issues
  if (imagePath.startsWith('data:')) return undefined
  
  // If it's a relative path, return as is (will be served by Next.js)
  return imagePath
}

// Usage in Avatar component
<AvatarImage src={getImageUrl(session.user?.image)} alt="Profile" />
```

## Migration

### Cleanup Existing Base64 Data
Run the cleanup script to remove any existing base64 image data:

```bash
npm run cleanup:images
```

This script will:
1. Find all users with base64 image data
2. Clear the image field for those users
3. Log the cleanup process

### Manual Cleanup
If you prefer to clean up manually:

```sql
-- Find users with base64 data
SELECT id, email FROM "User" WHERE image LIKE 'data:%';

-- Clear base64 data
UPDATE "User" SET image = NULL WHERE image LIKE 'data:%';
```

## Benefits

1. **No More Header Size Errors**: Images are served as static files
2. **Better Performance**: No large data in API responses
3. **Reduced Database Size**: Only file paths stored, not image data
4. **Better Caching**: Static files can be cached by CDNs and browsers
5. **Scalability**: Images don't impact API response times

## File Storage Location

```
public/
  uploads/
    avatars/
      .gitkeep
      avatar_user123_1234567890.jpg
      avatar_user456_1234567891.png
      ...
```

## Security Considerations

- Images are stored in the public directory (accessible to anyone)
- Filename includes user ID for basic access control
- Consider implementing additional access controls if needed
- File size and type validation on upload
- Only authenticated users can upload images

## Future Improvements

1. **Image Optimization**: Add image compression and resizing
2. **CDN Integration**: Serve images from a CDN for better performance
3. **Access Control**: Implement signed URLs for private images
4. **Image Formats**: Support modern formats like WebP and AVIF
5. **Thumbnail Generation**: Create multiple sizes for different use cases
