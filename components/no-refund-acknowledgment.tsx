'use client';

import React, { useState } from 'react';
import { REFUND_POLICY } from '../lib/pricing';
import { AlertTriangle, X, Shield, Scale, FileText } from 'lucide-react';

interface NoRefundAcknowledgmentProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  planName: string;
  planPrice: number;
  billingCycle?: 'monthly' | 'yearly';
}

export function NoRefundAcknowledgment({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  planName, 
  planPrice,
  billingCycle = 'monthly'
}: NoRefundAcknowledgmentProps) {
  const [hasReadPolicy, setHasReadPolicy] = useState(false);
  const [hasUnderstood, setHasUnderstood] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  
  const requiredText = "I WAIVE ALL REFUND RIGHTS";
  const canProceed = hasReadPolicy && hasUnderstood && hasAccepted && 
                    confirmationText.toUpperCase() === requiredText;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-red-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 mr-3 animate-pulse" />
              <h2 className="text-2xl font-bold">⚠️ CRITICAL LEGAL NOTICE ⚠️</h2>
            </div>
            <button
              onClick={onCancel}
              className="text-white hover:text-red-200 transition-colors"
              title="Close dialog"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="mt-2 text-red-100 font-semibold">
            MANDATORY REFUND POLICY ACKNOWLEDGMENT
          </p>
        </div>

        <div className="p-6">
          {/* Purchase Summary */}
          <div className="bg-gray-50 border-2 border-red-200 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-lg mb-2 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              You are about to purchase:
            </h3>
            <div className="text-xl font-bold text-red-600">
              {planName} Plan - ${planPrice} ONE-TIME PAYMENT
            </div>
            <p className="text-sm text-gray-600 mt-1">
              This is a DIGITAL SERVICE with immediate LIFETIME access
            </p>
          </div>

          {/* Legal Warning */}
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-lg text-red-800 mb-3 flex items-center">
              <Scale className="w-5 h-5 mr-2" />
              {REFUND_POLICY.message}
            </h3>
            <p className="text-red-700 font-semibold mb-3">
              {REFUND_POLICY.legalDisclaimer}
            </p>
            <p className="text-red-600 font-bold text-center py-2 border border-red-400 rounded">
              {REFUND_POLICY.emphasis}
            </p>
          </div>

          {/* Policy Details */}
          <div className="mb-6">
            <h4 className="font-bold text-lg mb-3 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-red-600" />
              What This Means (READ CAREFULLY):
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3 bg-gray-50">
              {REFUND_POLICY.details.map((detail, index) => (
                <div key={index} className="text-sm text-gray-800 flex items-start">
                  <span className="text-red-600 font-bold mr-2 mt-0.5">•</span>
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Consequences */}
          <div className="mb-6">
            <h4 className="font-bold text-lg mb-3 text-red-800">
              Consequences of Refund Attempts:
            </h4>
            <div className="space-y-2 bg-red-50 border border-red-200 rounded-lg p-3">
              {REFUND_POLICY.consequences.map((consequence, index) => (
                <div key={index} className="text-sm text-red-700 flex items-start">
                  <span className="text-red-800 font-bold mr-2 mt-0.5">⚡</span>
                  <span className="font-medium">{consequence}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mandatory Checkboxes */}
          <div className="space-y-4 mb-6 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
            <h4 className="font-bold text-lg text-yellow-800">
              Required Acknowledgments (ALL must be checked):
            </h4>
            
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasReadPolicy}
                onChange={(e) => setHasReadPolicy(e.target.checked)}
                className="mt-1 w-5 h-5 text-red-600"
                required
              />
              <span className="text-sm font-medium text-gray-800">
                I have READ and UNDERSTAND the complete no-refund policy above
              </span>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasUnderstood}
                onChange={(e) => setHasUnderstood(e.target.checked)}
                className="mt-1 w-5 h-5 text-red-600"
                required
              />
              <span className="text-sm font-medium text-gray-800">
                I UNDERSTAND that this purchase is 100% FINAL with ZERO refund possibility
              </span>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasAccepted}
                onChange={(e) => setHasAccepted(e.target.checked)}
                className="mt-1 w-5 h-5 text-red-600"
                required
              />
              <span className="text-sm font-medium text-gray-800">
                I LEGALLY WAIVE all refund rights and accept full financial responsibility
              </span>
            </label>
          </div>

          {/* Confirmation Text Input */}
          <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-lg p-4">
            <label className="block text-sm font-bold text-red-800 mb-2">
              Type EXACTLY: &quot;{requiredText}&quot; to confirm you understand
            </label>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Type the required text here..."
              className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:outline-none focus:border-red-500"
              required
            />
            {confirmationText && confirmationText.toUpperCase() !== requiredText && (
              <p className="text-red-600 text-sm mt-1 font-medium">
                ❌ Text must match exactly (case doesn&apos;t matter)
              </p>
            )}
            {confirmationText.toUpperCase() === requiredText && (
              <p className="text-green-600 text-sm mt-1 font-medium">
                ✅ Confirmation text accepted
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-500 text-white font-bold py-4 px-6 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel Purchase (Recommended)
            </button>
            <button
              onClick={onConfirm}
              disabled={!canProceed}
              className={`flex-1 font-bold py-4 px-6 rounded-lg transition-colors ${
                canProceed
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {canProceed 
                ? 'I ACCEPT - PROCEED TO PAYMENT' 
                : 'Complete All Requirements Above'
              }
            </button>
          </div>

          {/* Final Warning */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600">
              By clicking &quot;I ACCEPT&quot;, you are entering into a legally binding agreement
              with NO possibility of refund under any circumstances.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
