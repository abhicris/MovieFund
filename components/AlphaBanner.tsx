"use client";

import { useState } from "react";

export default function AlphaBanner() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 py-3 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-yellow-900 text-xs font-semibold px-3 py-1 rounded-full">
              ALPHA TESTNET
            </span>
            <span className="text-sm font-light text-yellow-900">
              This is an alpha-testnet version. Features coming soon:
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-xs font-light text-yellow-800">
            <span>• APIs</span>
            <span>• User Authentication</span>
            <span>• Movie Company Profiles</span>
            <span>• Investor Profiles</span>
            <span>• Onchain Records (Blockchain Ledger)</span>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-yellow-800 hover:text-yellow-900 ml-4"
          aria-label="Close banner"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="container mx-auto mt-2 md:hidden">
        <div className="text-xs font-light text-yellow-800 space-y-1">
          <div>• APIs</div>
          <div>• User Authentication</div>
          <div>• Movie Company Profiles</div>
          <div>• Investor Profiles</div>
          <div>• Onchain Records (Blockchain Ledger)</div>
        </div>
      </div>
    </div>
  );
}
