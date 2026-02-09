
import React, { useEffect, useRef } from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'mint' | 'sky';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    title = 'Confirm Action',
    message,
    confirmText = 'Yes, Continue',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    variant = 'mint'
}) => {
    const confirmButtonRef = useRef<HTMLButtonElement>(null);
    const cancelButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isOpen) {
            // Focus the cancel button by default for safety
            cancelButtonRef.current?.focus();

            // Handle Escape key
            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    onCancel();
                }
            };

            window.addEventListener('keydown', handleEscape);
            return () => window.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    const colors = {
        mint: {
            gradient: 'from-mint-400 to-mint-500',
            hover: 'hover:from-mint-500 hover:to-mint-600',
            ring: 'focus:ring-mint-400',
            glow: 'shadow-soft-lg'
        },
        sky: {
            gradient: 'from-sky-400 to-sky-500',
            hover: 'hover:from-sky-500 hover:to-sky-600',
            ring: 'focus:ring-sky-400',
            glow: 'shadow-soft-lg'
        }
    };

    const color = colors[variant];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-deep-green/20 backdrop-blur-sm"
                onClick={onCancel}
            ></div>

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-soft-lg border border-mint-200 max-w-md w-full p-8 animate-scale-in">
                {/* Decorative gradient orb */}
                <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${color.gradient} rounded-full blur-3xl opacity-10`}></div>

                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color.gradient} flex items-center justify-center ${color.glow}`}>
                        <i className="fa-solid fa-triangle-exclamation text-white text-2xl"></i>
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-black text-deep-green text-center mb-3">
                    {title}
                </h3>

                {/* Message */}
                <p className="text-sm text-slate-600 text-center font-medium leading-relaxed mb-8">
                    {message}
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        ref={cancelButtonRef}
                        onClick={onCancel}
                        className="flex-1 px-6 py-3 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-slate-400"
                    >
                        {cancelText}
                    </button>
                    <button
                        ref={confirmButtonRef}
                        onClick={onConfirm}
                        className={`flex-1 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-br ${color.gradient} ${color.hover} ${color.glow} transition-all active:scale-95 focus:outline-none focus:ring-2 ${color.ring}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { 
            opacity: 0;
            transform: scale(0.95);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
        </div>
    );
};

export default ConfirmationModal;
