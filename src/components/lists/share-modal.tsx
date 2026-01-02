'use client';

import * as React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { getShareUrl } from '@/lib/utils';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareCode: string;
  title: string;
}

export function ShareModal({ isOpen, onClose, shareCode, title }: ShareModalProps) {
  const [copied, setCopied] = React.useState(false);
  const shareUrl = getShareUrl(shareCode);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Food Buddy: ${title}`,
          text: `Check out this food list: ${title}`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error
        console.log('Share cancelled');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="relative">
          <CardTitle className="text-center">Share List</CardTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-4">
          {/* QR Code */}
          <div className="rounded-xl bg-white p-4 shadow-inner">
            <QRCodeSVG
              value={shareUrl}
              size={180}
              level="M"
              includeMargin={false}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>

          <p className="text-center text-sm text-gray-500">
            Scan this QR code to view the list
          </p>

          {/* URL */}
          <div className="flex w-full items-center gap-2 rounded-lg bg-gray-100 p-2">
            <span className="flex-1 truncate text-sm text-gray-600">
              {shareUrl}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="flex-shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Share buttons */}
          <div className="flex w-full gap-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>

            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <Button
                variant="default"
                className="flex-1"
                onClick={handleNativeShare}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
