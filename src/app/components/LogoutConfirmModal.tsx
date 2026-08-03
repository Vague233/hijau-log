import React from "react";
import { LogOut } from "lucide-react";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutConfirmModal({ isOpen, onClose, onConfirm }: LogoutConfirmModalProps) {
  return (
    <div 
      className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-500 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      <div 
        className={`relative bg-[var(--color-charcoal)] border border-white/10 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl transition-all duration-500 transform ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-5">
            <LogOut className="size-8 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Konfirmasi Keluar</h3>
          <p className="text-white/70 mb-8 text-sm">
            Apakah Anda yakin ingin keluar dari akun Anda?
          </p>
          <div className="flex items-center gap-3 w-full">
            <button 
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors font-medium text-sm"
            >
              Batal
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors font-medium text-sm shadow-lg shadow-red-500/20"
            >
              Keluar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
