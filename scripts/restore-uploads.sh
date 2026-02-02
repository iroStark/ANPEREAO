#!/bin/bash

# Script to restore uploads from backup
# Usage: ./scripts/restore-uploads.sh [backup_file]

UPLOADS_DIR="uploads"

if [ $# -eq 0 ]; then
    # Find latest backup
    BACKUP_FILE=$(ls -t backups/uploads_backup_*.tar.gz 2>/dev/null | head -1)
    if [ -z "$BACKUP_FILE" ]; then
        echo "❌ No backup file found in backups/"
        exit 1
    fi
    echo "📁 Using latest backup: $BACKUP_FILE"
else
    BACKUP_FILE="$1"
fi

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Create uploads directory if it doesn't exist
mkdir -p "$UPLOADS_DIR"

# Extract backup
echo "📦 Extracting $BACKUP_FILE..."
tar -xzf "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    FILE_COUNT=$(find "$UPLOADS_DIR" -type f | wc -l)
    echo "✅ Restored $FILE_COUNT files to $UPLOADS_DIR"
else
    echo "❌ Restore failed"
    exit 1
fi
