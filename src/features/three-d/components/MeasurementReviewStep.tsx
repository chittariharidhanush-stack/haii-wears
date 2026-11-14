"use client";

import React, { useState } from "react";
import { EstimatedMeasurements } from "../types/MeasurementTypes";
import { AvatarConfig, ConfirmedMeasurements } from "../types/AvatarTypes";
import { Check, Sliders, Sparkles, User, Info } from "lucide-react";

interface Props {
  initialEstimates: EstimatedMeasurements;
  onGenerate: (config: AvatarConfig) => void;
  onBack: () => void;
}

export default function MeasurementReviewStep({
  initialEstimates,
  onGenerate,
  onBack
}: Props) {
  const [heightCm, setHeightCm] = useState(initialEstimates.heightCm);
  const [chestCm, setChestCm] = useState(initialEstimates.chestCm);
  const [waistCm, setWaistCm] = useState(initialEstimates.waistCm);
  const [hipCm, setHipCm] = useState(initialEstimates.hipCm);

  const [gender, setGender] = useState<"masculine" | "feminine" | "unisex">("masculine");
  const [build, setBuild] = useState<"slim" | "athletic" | "regular" | "broad">("athletic");
  const [skinTone, setSkinTone] = useState("#181818");

  const skinTones = [
    { name: "Obsidian", hex: "#181818" },
    { name: "Midnight Bronze", hex: "#3a2618" },
    { name: "Deep Umber", hex: "#241510" },
    { name: "Porcelain", hex: "#e0cbb7" },
    { name: "Chrome Silver", hex: "chrome" }
  ];

  const handleConfirmAndGenerate = (e: React.FormEvent) => {
    e.preventDefault();

    const confirmed: ConfirmedMeasurements = {
      heightCm,
      chestCm,
      waistCm,
      hipCm,
      confirmedAt: Date.now(),
      source: initialEstimates.confidence === "calibrated" ? "photo-estimated" : "manual"
    };

    const avatarConfig: AvatarConfig = {
      id: `avatar_${Date.now()}`,
      gender,
      build,
      skinTone,
      measurements: confirmed,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      engineVersion: "oxihuman-0.2.0"
    };

    onGenerate(avatarConfig);
  };

  return (
    <form onSubmit={handleConfirmAndGenerate} className="flex flex-col gap-6 text-white">
      <div className="flex flex-col gap-1 border-b border-[#222] pb-4">
        <span className="font-tech text-xs tracking-widest text-[#f2342b] uppercase font-bold">
          STEP 3 // MEASUREMENT CONFIRMATION & AVATAR GENERATION
        </span>
        <h3 className="font-display text-2xl tracking-wide uppercase">
          REVIEW & REFINE YOUR MEASUREMENTS
        </h3>
        <p className="font-tech text-xs text-[#888]">
          Review estimated circumferences below. Adjust any values you know accurately to refine your 3D body proportions before generating the avatar.
        </p>
      </div>

      {/* Measurement Confirmation Table */}
      <div className="border border-[#222] bg-[#0c0c0c] rounded-xs overflow-hidden font-tech">
        <div className="grid grid-cols-12 bg-[#141414] px-4 py-2.5 text-[11px] text-[#888] uppercase tracking-wider border-b border-[#222]">
          <span className="col-span-4">Measurement</span>
          <span className="col-span-4 text-center">Estimated Value</span>
          <span className="col-span-4 text-right">Adjust / Confirm</span>
        </div>

        {/* Height */}
        <div className="grid grid-cols-12 px-4 py-3 items-center border-b border-[#1a1a1a] text-xs">
          <div className="col-span-4 flex flex-col">
            <span className="text-white font-bold uppercase">Standing Height</span>
            <span className="text-[10px] text-[#666]">Ground to crown</span>
          </div>
          <span className="col-span-4 text-center text-[#aaa]">{heightCm} cm</span>
          <div className="col-span-4 flex items-center justify-end gap-2">
            <input
              type="number"
              min={140}
              max={220}
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
              className="w-18 bg-[#181818] border border-[#333] px-2 py-1 text-center font-bold text-white rounded-xs focus:border-[#f2342b] outline-none"
            />
            <span className="text-[11px] text-[#666]">cm</span>
          </div>
        </div>

        {/* Chest */}
        <div className="grid grid-cols-12 px-4 py-3 items-center border-b border-[#1a1a1a] text-xs">
          <div className="col-span-4 flex flex-col">
            <span className="text-white font-bold uppercase">Chest Circumference</span>
            <span className="text-[10px] text-[#666]">Fullest bust/chest</span>
          </div>
          <span className="col-span-4 text-center text-[#aaa]">{chestCm} cm</span>
          <div className="col-span-4 flex items-center justify-end gap-2">
            <input
              type="number"
              min={65}
              max={150}
              value={chestCm}
              onChange={(e) => setChestCm(Number(e.target.value))}
              className="w-18 bg-[#181818] border border-[#333] px-2 py-1 text-center font-bold text-white rounded-xs focus:border-[#f2342b] outline-none"
            />
            <span className="text-[11px] text-[#666]">cm</span>
          </div>
        </div>

        {/* Waist */}
        <div className="grid grid-cols-12 px-4 py-3 items-center border-b border-[#1a1a1a] text-xs">
          <div className="col-span-4 flex flex-col">
            <span className="text-white font-bold uppercase">Waist Circumference</span>
            <span className="text-[10px] text-[#666]">Narrowest torso point</span>
          </div>
          <span className="col-span-4 text-center text-[#aaa]">{waistCm} cm</span>
          <div className="col-span-4 flex items-center justify-end gap-2">
            <input
              type="number"
              min={50}
              max={140}
              value={waistCm}
              onChange={(e) => setWaistCm(Number(e.target.value))}
              className="w-18 bg-[#181818] border border-[#333] px-2 py-1 text-center font-bold text-white rounded-xs focus:border-[#f2342b] outline-none"
            />
            <span className="text-[11px] text-[#666]">cm</span>
          </div>
        </div>

        {/* Hips */}
        <div className="grid grid-cols-12 px-4 py-3 items-center text-xs">
          <div className="col-span-4 flex flex-col">
            <span className="text-white font-bold uppercase">Hip Circumference</span>
            <span className="text-[10px] text-[#666]">Widest pelvic span</span>
          </div>
          <span className="col-span-4 text-center text-[#aaa]">{hipCm} cm</span>
          <div className="col-span-4 flex items-center justify-end gap-2">
            <input
              type="number"
              min={65}
              max={155}
              value={hipCm}
              onChange={(e) => setHipCm(Number(e.target.value))}
              className="w-18 bg-[#181818] border border-[#333] px-2 py-1 text-center font-bold text-white rounded-xs focus:border-[#f2342b] outline-none"
            />
            <span className="text-[11px] text-[#666]">cm</span>
          </div>
        </div>
      </div>

      {/* Build & Silhouette Preferences */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Anatomical Build */}
        <div className="flex flex-col gap-2 p-3.5 bg-[#111] border border-[#222] rounded-xs font-tech">
          <span className="text-xs uppercase font-bold text-white tracking-wider">
            Body Build Silhouette
          </span>
          <div className="grid grid-cols-4 gap-1.5">
            {(["slim", "athletic", "regular", "broad"] as const).map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBuild(b)}
                className={`py-2 text-[10px] uppercase font-bold tracking-wider rounded-xs transition ${
                  build === b
                    ? "bg-[#f2342b] text-white"
                    : "bg-[#181818] text-[#888] hover:text-white"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Skin Tone Finish */}
        <div className="flex flex-col gap-2 p-3.5 bg-[#111] border border-[#222] rounded-xs font-tech">
          <span className="text-xs uppercase font-bold text-white tracking-wider">
            Skin Tone / Mannequin Finish
          </span>
          <div className="flex items-center gap-2">
            {skinTones.map((tone) => (
              <button
                key={tone.name}
                type="button"
                onClick={() => setSkinTone(tone.hex)}
                className={`w-7 h-7 rounded-full transition border-2 flex items-center justify-center ${
                  skinTone === tone.hex ? "border-[#f2342b] scale-110" : "border-[#333]"
                }`}
                style={{
                  background:
                    tone.hex === "chrome"
                      ? "linear-gradient(135deg, #e5e5e5 0%, #888 50%, #ffffff 100%)"
                      : tone.hex
                }}
                title={tone.name}
              >
                {skinTone === tone.hex && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between border-t border-[#222] pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 bg-transparent border border-[#333] hover:border-white text-white font-tech text-xs uppercase tracking-wider transition"
        >
          Back
        </button>

        <button
          type="submit"
          className="px-6 py-3 bg-[#f2342b] hover:bg-[#d82a22] text-white font-tech text-xs font-bold uppercase tracking-widest transition flex items-center gap-2 shadow-lg shadow-[#f2342b]/20"
        >
          <Sparkles className="w-4 h-4" />
          <span>GENERATE PERSONALIZED 3D AVATAR</span>
        </button>
      </div>
    </form>
  );
}
