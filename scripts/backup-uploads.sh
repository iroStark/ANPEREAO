#!/bin/bash

# Script to backup uploads before deploy
# Usage: ./scripts/backup-uploads.sh

BACKUP_DIR="backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
UPLOADS_DIR="uploads"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Check if uploads directory exists
if [ ! -d "$UPLOADS_DIR" ]; then
    echo "❌ Uploads directory not found: $UPLOADS_DIR"
    exit 1
fi

# Count files
FILE_COUNT=$(find "$UPLOADS_DIR" -type f | wc -l)
echo "📁 Found $FILE_COUNT files in $UPLOADS_DIR"

# Create tar.gz backup
BACKUP_FILE="$BACKUP_DIR/uploads_backup_$TIMESTAMP.tar.gz"
tar -czf "$BACKUP_FILE" "$UPLOADS_DIR"

if [ $? -eq 0 ]; then
    echo "✅ Backup created: $BACKUP_FILE"
    echo "📊 Size: $(du -h "$BACKUP_FILE" | cut -f1)"
else
    echo "❌ Backup failed"
    exit 1
fi

# List recent backups
echo ""
echo "📋 Recent backups:"
ls -lh "$BACKUP_DIR"/*.tar.gz 2>/dev/null | tail -5
