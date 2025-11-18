#!/usr/bin/env python3
"""Script to remove all emoticons from markdown and shell files"""

import re
import os
from pathlib import Path

# Comprehensive emoticon patterns
EMOTICON_PATTERNS = [
    r'📋', r'✅', r'🎯', r'🚀', r'📁', r'🎥', r'⚙️', r'🔧',
    r'📊', r'💡', r'🚨', r'📖', r'🎉', r'🎓', r'📚', r'📝',
    r'💻', r'📱', r'🖼️', r'📉', r'💾', r'🎨', r'🔄', r'📦',
    r'⚡', r'🔵', r'🔴', r'✨', r'⚪', r'🔍', r'⚠️', r'❗',
    r'📞', r'🆘', r'❌', r'🏆', r'🎭', r'🌟', r'💰', r'🛠️',
    r'🔐', r'🌐', r'📈', r'📉', r'🧪', r'🧰', r'⏱️', r'🎬',
]

# Compile pattern to match any emoticon
EMOTICON_REGEX = re.compile('|'.join(EMOTICON_PATTERNS))

def remove_emoticons_from_file(file_path):
    """Remove emoticons from a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if file contains emoticons
        if not EMOTICON_REGEX.search(content):
            return False
        
        # Remove all emoticons
        cleaned_content = EMOTICON_REGEX.sub('', content)
        
        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(cleaned_content)
        
        return True
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    """Main function to process all markdown and shell files"""
    root_dir = Path('.')
    
    # File patterns to process
    patterns = ['**/*.md', '**/*.sh']
    
    # Exclude node_modules and other directories
    exclude_dirs = {'node_modules', '.next', '.git', 'dist', 'build'}
    
    files_processed = 0
    files_modified = 0
    
    for pattern in patterns:
        for file_path in root_dir.glob(pattern):
            # Skip excluded directories
            if any(excluded in file_path.parts for excluded in exclude_dirs):
                continue
            
            files_processed += 1
            if remove_emoticons_from_file(file_path):
                files_modified += 1
                print(f"Cleaned: {file_path}")
    
    print(f"\nSummary:")
    print(f"  Files processed: {files_processed}")
    print(f"  Files modified: {files_modified}")

if __name__ == '__main__':
    main()
