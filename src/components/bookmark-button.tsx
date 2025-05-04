
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Bookmark } from 'lucide-react';

export function BookmarkButton() {
  const { toast } = useToast();

  const handleBookmarkClick = () => {
    toast({
      title: 'Bookmark Page',
      description: 'Press Ctrl+D (or Cmd+D on Mac) to bookmark this page.',
      duration: 5000, // Show toast for 5 seconds
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleBookmarkClick}
      aria-label="Add this page to your bookmarks"
    >
      <Bookmark className="mr-2 h-4 w-4" />
      Add to Bookmarks
    </Button>
  );
}
