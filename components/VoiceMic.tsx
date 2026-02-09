import React, { useState, useRef, useEffect } from 'react';
import { MIC_STATES, TEXT_PRIMARY } from '../services/theme';

interface VoiceMicProps {
    isListening: boolean;
    onStartListening: () => void;
    onStopListening: () => void;
    statusMessage?: string;
}

const VoiceMic: React.FC<VoiceMicProps> = ({
    isListening,
    onStartListening,
    onStopListening,
    statusMessage
}) => {
    const [position, setPosition] = useState({ x: window.innerWidth - 120, y: window.innerHeight - 120 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [showTooltip, setShowTooltip] = useState(false);
    const micRef = useRef<HTMLDivElement>(null);

    // 🌿 Get current mic state style
    const micStyle = isListening ? MIC_STATES.listening : MIC_STATES.idle;

    // Handle mouse down - start dragging
    const handleMouseDown = (e: React.MouseEvent) => {
        if (micRef.current) {
            const rect = micRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
            setIsDragging(true);
        }
    };

    // Handle mouse move - update position while dragging
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                const newX = e.clientX - dragOffset.x;
                const newY = e.clientY - dragOffset.y;

                // Constrain to viewport
                const maxX = window.innerWidth - 80;
                const maxY = window.innerHeight - 80;

                setPosition({
                    x: Math.max(0, Math.min(newX, maxX)),
                    y: Math.max(0, Math.min(newY, maxY)),
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset]);

    // Handle click to toggle listening
    const handleClick = () => {
        if (!isDragging) {
            if (isListening) {
                onStopListening();
            } else {
                onStartListening();
            }
        }
    };

    return (
        <>
            {/* Microphone Button */}
            <div
                ref={micRef}
                style={{
                    position: 'fixed',
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    cursor: isDragging ? 'grabbing' : 'grab',
                    zIndex: 9999,
                }}
                onMouseDown={handleMouseDown}
                onClick={handleClick}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="select-none"
            >
                {/* Outer Container */}
                <div className="relative">
                    {/* 🌿 Soft Ripple Animation when listening */}
                    {isListening && (
                        <>
                            <div 
                                className="absolute inset-0 rounded-full animate-ripple"
                                style={{ backgroundColor: MIC_STATES.listening.bg, opacity: 0.3 }}
                            ></div>
                            <div 
                                className="absolute inset-0 rounded-full animate-ripple"
                                style={{ backgroundColor: MIC_STATES.listening.bg, opacity: 0.2, animationDelay: '0.5s' }}
                            ></div>
                        </>
                    )}

                    {/* Main Button - 🌿 Soft Mint Theme */}
                    <div
                        className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isListening ? 'scale-105' : 'hover:scale-105'
                        }`}
                        style={{
                            backgroundColor: micStyle.bg,
                            boxShadow: `0 8px 24px ${micStyle.shadow}, 0 4px 8px rgba(0, 0, 0, 0.1)`,
                        }}
                    >
                        {/* Microphone Icon */}
                        <i
                            className={`fa-solid fa-microphone text-3xl transition-all duration-300 ${
                                isListening ? 'animate-pulse' : ''
                            }`}
                            style={{ color: micStyle.text }}
                        ></i>

                        {/* Gentle glow ring when listening */}
                        {isListening && (
                            <div 
                                className="absolute inset-0 rounded-full animate-glow-fade"
                                style={{ 
                                    border: `3px solid ${MIC_STATES.listening.bg}`,
                                    opacity: 0.5 
                                }}
                            ></div>
                        )}
                    </div>

                    {/* Status Badge */}
                    {isListening && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-soft-md border border-mint-200">
                            <div 
                                className="w-2.5 h-2.5 rounded-full animate-pulse"
                                style={{ backgroundColor: MIC_STATES.listening.bg }}
                            ></div>
                        </div>
                    )}
                </div>

                {/* Drag Handle Indicator */}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                    <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                    <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                    <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                </div>
            </div>

            {/* Tooltip */}
            {showTooltip && !isDragging && (
                <div
                    style={{
                        position: 'fixed',
                        left: `${position.x - 60}px`,
                        top: `${position.y - 50}px`,
                        zIndex: 10000,
                    }}
                    className="pointer-events-none"
                >
                    <div 
                        className="bg-white px-4 py-2 rounded-xl text-sm font-semibold shadow-soft-lg whitespace-nowrap border border-mint-200"
                        style={{ color: TEXT_PRIMARY }}
                    >
                        <div className="flex items-center gap-2">
                            <i className={`fa-solid ${isListening ? 'fa-stop' : 'fa-microphone'} text-xs`}></i>
                            <span>{isListening ? 'Stop Listening' : 'Click to Speak'}</span>
                        </div>
                        {/* Arrow pointing down to mic */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-6px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white"></div>
                    </div>
                </div>
            )}

            {/* Status Message Popup */}
            {statusMessage && (
                <div
                    style={{
                        position: 'fixed',
                        left: `${position.x - 100}px`,
                        top: `${position.y + 90}px`,
                        zIndex: 10000,
                    }}
                    className="pointer-events-none animate-fade-in"
                >
                    <div className="bg-white shadow-soft-lg rounded-2xl px-6 py-3 border border-mint-200">
                        <div 
                            className="text-sm font-semibold text-center max-w-[250px]"
                            style={{ color: TEXT_PRIMARY }}
                        >
                            {statusMessage}
                        </div>
                    </div>
                </div>
            )}

            {/* 🌿 Gentle ripple waves when Listening */}
            {isListening && (
                <div
                    style={{
                        position: 'fixed',
                        left: `${position.x + 40}px`,
                        top: `${position.y + 40}px`,
                        zIndex: 9998,
                        pointerEvents: 'none',
                    }}
                >
                    <div className="relative">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                                style={{
                                    width: `${(i + 1) * 100}px`,
                                    height: `${(i + 1) * 100}px`,
                                    border: `2px solid ${MIC_STATES.listening.bg}`,
                                    opacity: 0.2,
                                    animation: `ripple 2s cubic-bezier(0, 0, 0.2, 1) infinite`,
                                    animationDelay: `${i * 0.4}s`,
                                }}
                            ></div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default VoiceMic;
