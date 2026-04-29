import React from 'react';

interface Props {
  iframeUrl: string;
  onClose: () => void;
}

export const PaymobIframe: React.FC<Props> = ({ iframeUrl, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <span className="font-semibold text-sm">Secure Payment</span>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>
        <iframe
          src={iframeUrl}
          className="w-full h-[520px]"
          frameBorder="0"
          title="Paymob Payment"
          allow="payment"
        />
      </div>
    </div>
  );
};
