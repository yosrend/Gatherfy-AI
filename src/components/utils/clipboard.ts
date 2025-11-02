import { toast } from 'sonner';

/**
 * Copy text to clipboard with fallback for environments where Clipboard API is blocked
 */
export async function copyToClipboard(text: string, successMessage?: string): Promise<boolean> {
  // Try modern Clipboard API first
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      if (successMessage) {
        toast.success(successMessage);
      }
      return true;
    } catch (err) {
      // Fall through to fallback method
    }
  }

  // Fallback method using textarea
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (successful) {
      if (successMessage) {
        toast.success(successMessage);
      }
      return true;
    }
  } catch (err) {
    // Fallback failed
  }

  // If all methods fail, show the text in a prompt as last resort
  toast.error('Unable to copy automatically. Please copy manually:', {
    description: text,
    duration: 10000,
  });
  
  return false;
}
