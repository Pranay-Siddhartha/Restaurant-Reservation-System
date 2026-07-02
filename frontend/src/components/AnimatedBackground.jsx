import React from 'react';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-[#0a0a0a]">
      {/* Top right blob */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#d6a87c]/20 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob" />
      {/* Top left blob */}
      <div className="absolute top-[20%] left-[-10%] w-72 h-72 bg-[#c69a71]/10 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-2000" />
      {/* Bottom center blob */}
      <div className="absolute bottom-[-20%] left-[20%] w-[40rem] h-[40rem] bg-[#d6a87c]/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
    </div>
  );
}
