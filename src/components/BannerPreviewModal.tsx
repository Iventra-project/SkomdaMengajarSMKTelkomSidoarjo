import React from 'react';
import { useApp } from '../context/AppContext';

export const BannerPreviewModal: React.FC = () => {
  const { isBannerModalOpen, setIsBannerModalOpen, bannerStatus } = useApp();

  if (!isBannerModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#b4000c] text-white flex items-center justify-center font-bold text-xs">
              B1
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Pratinjau Resmi X-Banner: Kelompok 03 — SMPN 1 Buduran
              </h3>
              <p className="text-xs text-slate-500">
                Dimensi: 60 cm × 160 cm • Resolusi Cetak: CMYK 300 DPI • Format: PDF Vector High-Res (28.4 MB)
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsBannerModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex flex-col md:flex-row items-center justify-center gap-8 bg-slate-100/60">
          {/* Vertical Mockup */}
          <div className="relative w-full max-w-[280px] aspect-[9/20] bg-white rounded-lg border-2 border-slate-300 shadow-lg overflow-hidden flex flex-col justify-between p-4">
            {/* Top Banner Header */}
            <div className="flex flex-col items-center text-center space-y-1 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-extrabold italic text-slate-900 tracking-tight">#SKOMDA</span>
                <span className="bg-[#e20113] text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                  MENGAJAR
                </span>
              </div>
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">
                #IMPACT2026 / SMK TELKOM SIDOARJO
              </span>
            </div>

            {/* School Hero Emblem */}
            <div className="my-auto py-4 flex flex-col items-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-[#b4000c]">
                <span className="material-symbols-outlined text-[32px]">school</span>
              </div>
              <div>
                <span className="inline-block bg-[#b4000c] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  KELOMPOK 03
                </span>
                <h4 className="text-base font-extrabold text-slate-900 mt-1">SMPN 1 BUDURAN</h4>
                <p className="text-[11px] text-slate-600 font-medium">Workshop Literasi AI & Canva Kreatif</p>
              </div>

              {/* Mentors Badge */}
              <div className="p-2 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-600 w-full space-y-1">
                <div>Guru Pamong: <strong>Bu Sri Wahyuni, M.Pd</strong></div>
                <div>Guru Pembimbing: <strong>Pak Budi Hartono, S.Kom</strong></div>
                <div>Ketua Regu: <strong>Ahmad Rizky (XII RPL 2)</strong></div>
              </div>
            </div>

            {/* Bottom Slogan */}
            <div className="pt-3 border-t border-slate-200 text-center">
              <p className="text-[9px] font-bold text-slate-800 uppercase tracking-wide">
                Membangun Generasi Muda Cerdas Digital
              </p>
              <div className="flex items-center justify-between mt-2 text-[8px] text-slate-400">
                <span>60 × 160 cm</span>
                <span className="text-emerald-700 font-semibold">Siap Cetak CMYK</span>
                <span>Ref: KLP-2026-03</span>
              </div>
            </div>

            {/* Status Stamp Overlay */}
            {bannerStatus === 'approved' && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-15deg] border-4 border-emerald-600 text-emerald-600 px-4 py-1.5 rounded-lg text-lg font-extrabold uppercase tracking-widest bg-white/90 shadow-lg pointer-events-none">
                DISETUJUI
              </div>
            )}
            {bannerStatus === 'revision' && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-15deg] border-4 border-amber-600 text-amber-600 px-4 py-1.5 rounded-lg text-lg font-extrabold uppercase tracking-widest bg-white/90 shadow-lg pointer-events-none">
                PERLU REVISI
              </div>
            )}
          </div>

          {/* Technical Specs & Checks */}
          <div className="flex-1 max-w-md space-y-4 text-xs">
            <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#b4000c]">fact_check</span>
                Hasil Uji Kelayakan Percetakan:
              </h4>
              <ul className="space-y-1.5 text-slate-600">
                <li className="flex items-center gap-2 text-emerald-700">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Rasio proporsional 60 : 160 cm sesuai standar tiang X-Banner</span>
                </li>
                <li className="flex items-center gap-2 text-emerald-700">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Resolusi 300 DPI - tidak pecah saat dicetak skala 1:1</span>
                </li>
                <li className="flex items-center gap-2 text-emerald-700">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Ruang warna CMYK (Tinta cetak akurat warna merah Telkom)</span>
                </li>
                <li className="flex items-center gap-2 text-emerald-700">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Bleed keliling 1 cm untuk finishing mata ayam lubang pojok</span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-lg text-amber-900 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">info</span>
                Ketentuan Percetakan Rekanan:
              </span>
              <p className="text-[11px] leading-relaxed">
                Pencetakan fisik banner dilakukan serentak di percetakan mitra SMK Telkom Sidoarjo setelah disetujui oleh Admin Kurikulum. Biaya cetak ditanggung penuh oleh subsidi program #Impact2026.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">File: X-Banner_Kelompok03_Final.pdf (28.4 MB)</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBannerModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
            >
              Tutup
            </button>
            <a
              href="#unduh"
              onClick={(e) => {
                e.preventDefault();
                alert('Mengunduh paket PDF cetak beresolusi tinggi...');
              }}
              className="px-4 py-2 rounded-lg bg-[#b4000c] hover:bg-slate-900 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Unduh PDF Cetak (28.4 MB)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
