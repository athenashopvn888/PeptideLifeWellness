'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

const STORAGE_KEY = 'plw_age_verified';

export default function AgeVerificationGate() {
  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setVerified(stored === 'true');
  }, []);

  const handleVerify = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVerified(true);
  };

  const handleDecline = () => {
    window.location.href = 'https://www.google.com';
  };

  // Still loading from localStorage
  if (verified === null) return null;

  // Already verified
  if (verified) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy/90 backdrop-blur-md"
      id="age-verification-gate"
    >
      <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full mx-4 text-center shadow-2xl animate-fade-in-up">
        {/* Logo / Shield */}
        <div className="w-16 h-16 rounded-2xl bg-green-soft flex items-center justify-center mx-auto mb-5">
          <ShieldCheck size={32} className="text-green" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-navy">
          Age Verification Required
        </h2>
        <p className="mt-3 text-sm text-gray leading-relaxed">
          You must be <strong className="text-navy">18 years of age or older</strong> to access this
          website.
        </p>

        {/* Legal Disclaimer */}
        <div className="mt-5 bg-silver rounded-xl p-4 text-left">
          <p className="text-xs text-gray leading-relaxed">
            By clicking &ldquo;I Am 18 or Older,&rdquo; you confirm that you meet the minimum age requirement
            and acknowledge that all products on this site are sold strictly for{' '}
            <strong className="text-navy">laboratory research purposes only</strong>. These products
            are not intended for human or veterinary use and are not approved as drugs, supplements,
            or treatments.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={handleVerify}
            className="w-full inline-flex items-center justify-center gap-2 bg-navy text-white px-6 py-3.5 rounded-full text-sm font-semibold hover:bg-navy-light transition-all shadow-lg"
            id="age-verify-confirm"
          >
            <ShieldCheck size={16} />
            I Am 18 or Older
          </button>
          <button
            onClick={handleDecline}
            className="w-full inline-flex items-center justify-center gap-2 bg-silver text-gray px-6 py-3 rounded-full text-sm font-medium hover:bg-border transition-all"
            id="age-verify-decline"
          >
            I Am Under 18
          </button>
        </div>

        <p className="mt-4 text-[10px] text-gray-light">
          For research use only. Not for human consumption.
        </p>
      </div>
    </div>
  );
}
