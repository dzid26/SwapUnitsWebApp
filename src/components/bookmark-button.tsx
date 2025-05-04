
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Bookmark } from 'lucide-react';

export function BookmarkButton() {
  const { toast } = useToast();
  const [isMac, setIsMac] = React.useState(false);

  React.useEffect(() => {
    // This check runs only on the client after hydration
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  const handleBookmarkClick = () => {
    const keyCombination = isMac ? 'Cmd+D' : 'Ctrl+D';

    // Show toast notification first
    toast({
      variant: "success", // Use the new success variant
      title: 'Bookmark Page',
      description: `Press ${keyCombination} to bookmark this page.`,
      duration: 5000, // Show toast for 5 seconds
    });

    // Attempt to trigger the browser's bookmark dialog programmatically (experimental and limited)
    // This has very limited browser support and might not work reliably or at all.
    // It's generally better practice to instruct the user as the toast does.
    try {
      // Try the older window.sidebar method (Firefox)
      if ((window as any).sidebar && (window as any).sidebar.addPanel) {
        (window as any).sidebar.addPanel(document.title, window.location.href, '');
      }
      // Try a generic alert fallback if specific methods fail (more likely)
      else {
         // No reliable cross-browser way to trigger the bookmark dialog directly via JS
         // due to security restrictions. The toast instruction remains the primary method.
         console.warn("Automatic bookmark triggering is not reliably supported across browsers. Please use the keyboard shortcut.");
      }
    } catch (error) {
      console.error("Error attempting to trigger bookmark:", error);
      // Fallback to the toast message which is already displayed
    }
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
