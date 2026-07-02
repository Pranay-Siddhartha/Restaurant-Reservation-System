import { HiUser, HiMinus, HiPlus } from 'react-icons/hi';

export default function VisualTable({ currentGuests = 1, onChange }) {
  const maxSeats = 6;
  const seats = Array.from({ length: maxSeats }, (_, i) => i + 1);

  const handleDecrease = () => {
    if (currentGuests > 1) onChange(currentGuests - 1);
  };

  const handleIncrease = () => {
    if (currentGuests < maxSeats) onChange(currentGuests + 1);
  };

  return (
    <div className="relative w-full aspect-square max-w-[400px] mx-auto flex items-center justify-center">
      {/* Table itself */}
      <div className="absolute inset-[20%] rounded-full border border-gray-200/20 bg-gray-100 shadow-glass-lg flex items-center justify-center z-10 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button 
            type="button" 
            onClick={handleDecrease}
            disabled={currentGuests <= 1}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200/50 hover:bg-gray-200 text-gray-700 disabled:opacity-30 transition-colors"
          >
            <HiMinus className="w-4 h-4" />
          </button>
          
          <div className="text-center w-16">
            <span className="block text-5xl font-bold text-gray-900 leading-none mb-1">{currentGuests}</span>
            <span className="block text-[10px] uppercase tracking-widest text-gray-500 font-medium">Guests</span>
          </div>

          <button 
            type="button" 
            onClick={handleIncrease}
            disabled={currentGuests >= maxSeats}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200/50 hover:bg-gray-200 text-gray-700 disabled:opacity-30 transition-colors"
          >
            <HiPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Seats */}
      {seats.map((seatNum) => {
        const isSelected = seatNum <= currentGuests;
        const angle = (seatNum - 1) * (360 / maxSeats);
        
        // 0 degrees is top
        const radiusPercent = 44; // Distance from center
        const x = 50 + radiusPercent * Math.sin((angle * Math.PI) / 180);
        const y = 50 - radiusPercent * Math.cos((angle * Math.PI) / 180);
        
        return (
          <div
            key={seatNum}
            className="absolute w-14 h-14 flex items-center justify-center rounded-full transition-all duration-300 z-20"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: `translate(-50%, -50%) rotate(${angle}deg)`
            }}
          >
            <HiUser 
              className={`w-full h-full transition-all duration-500 ${
                isSelected 
                  ? 'text-indigo-600 drop-shadow-[0_0_12px_rgba(214,168,124,0.6)] scale-100' 
                  : 'text-gray-300 scale-90'
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}
