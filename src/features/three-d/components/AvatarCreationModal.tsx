"use client";

import React, { useState } from "react";
import { PhotoCaptureInput, EstimatedMeasurements } from "../types/MeasurementTypes";
import { AvatarConfig } from "../types/AvatarTypes";
import { AvatarStorage } from "../services/avatar/AvatarStorage";
import PhotoUploadStep from "./PhotoUploadStep";
import PhotoValidationStep from "./PhotoValidationStep";
import MeasurementReviewStep from "./MeasurementReviewStep";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAvatarCreated: (avatar: AvatarConfig) => void;
}

export default function AvatarCreationModal({
  isOpen,
  onClose,
  onAvatarCreated
}: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [photoInput, setPhotoInput] = useState<PhotoCaptureInput | null>(null);
  const [estimatedMeasurements, setEstimatedMeasurements] = useState<EstimatedMeasurements | null>(null);

  if (!isOpen) return null;

  const handleStep1Next = (input: PhotoCaptureInput) => {
    setPhotoInput(input);
    setStep(2);
  };

  const handleStep2Confirm = (estimates: EstimatedMeasurements) => {
    setEstimatedMeasurements(estimates);
    setStep(3);
  };

  const handleStep3Generate = async (avatarConfig: AvatarConfig) => {
    // 1. Save to client-side IndexedDB
    await AvatarStorage.saveAvatar(avatarConfig);

    // 2. Deliver created avatar to studio
    onAvatarCreated(avatarConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#090909] border border-[#222] rounded-xs shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#777] hover:text-white transition"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Progress Indicators */}
        <div className="flex items-center gap-2 mb-6">
          <div className={`h-1 flex-1 rounded-full ${step >= 1 ? "bg-[#f2342b]" : "bg-[#222]"}`} />
          <div className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-[#f2342b]" : "bg-[#222]"}`} />
          <div className={`h-1 flex-1 rounded-full ${step >= 3 ? "bg-[#f2342b]" : "bg-[#222]"}`} />
        </div>

        {step === 1 && (
          <PhotoUploadStep onNext={handleStep1Next} onCancel={onClose} />
        )}

        {step === 2 && photoInput && (
          <PhotoValidationStep
            input={photoInput}
            onConfirm={handleStep2Confirm}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && estimatedMeasurements && (
          <MeasurementReviewStep
            initialEstimates={estimatedMeasurements}
            onGenerate={handleStep3Generate}
            onBack={() => setStep(2)}
          />
        )}
      </div>
    </div>
  );
}
