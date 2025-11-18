#!/bin/bash

# Script to generate thumbnails from videos
# Generates a thumbnail at 1 second into each video

VIDEO_DIR="public/assets/video"
THUMB_DIR="public/assets/images/video-thumbnails"

# Create thumbnail directory if it doesn't exist
mkdir -p "$THUMB_DIR"

echo "Generating video thumbnails..."
echo "================================"

# Counter for progress
count=0
total=$(find "$VIDEO_DIR" -name "*.mp4" | wc -l)

# Loop through all mp4 files
find "$VIDEO_DIR" -name "*.mp4" | while read -r video; do
    # Get filename without extension
    filename=$(basename "$video" .mp4)
    
    # Output thumbnail path
    thumbnail="$THUMB_DIR/${filename}.jpg"
    
    # Skip if thumbnail already exists
    if [ -f "$thumbnail" ]; then
        echo "✓ Skipping (exists): $filename"
    else
        # Try to generate thumbnail at 1 second, if fails try at 0.5 seconds
        ffmpeg -i "$video" -ss 00:00:01.000 -vframes 1 -vf "scale=295:525:force_original_aspect_ratio=increase,crop=295:525" "$thumbnail" -y -loglevel quiet
        
        if [ $? -ne 0 ]; then
            # Try earlier timestamp
            ffmpeg -i "$video" -ss 00:00:00.500 -vframes 1 -vf "scale=295:525:force_original_aspect_ratio=increase,crop=295:525" "$thumbnail" -y -loglevel quiet
        fi
        
        if [ $? -eq 0 ] || [ -f "$thumbnail" ]; then
            echo "✓ Generated: $filename.jpg"
        else
            echo "✗ Failed: $filename"
        fi
    fi
    
    count=$((count + 1))
    echo "Progress: $count/$total"
done

echo "================================"
echo "Thumbnail generation complete!"
echo "Thumbnails saved to: $THUMB_DIR"
