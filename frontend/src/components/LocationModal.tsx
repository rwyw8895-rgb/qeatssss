import React, { useState } from 'react';
import { MapPin, Navigation, Check, X, Compass } from 'lucide-react';
import { LocationPreset } from '../types';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLat: number;
  currentLng: number;
  onSelectLocation: (lat: number, lng: number, name: string) => void;
}

export const PRESET_LOCATIONS: LocationPreset[] = [
  { name: 'HSR Layout', area: 'Sector 1, Bengaluru', latitude: 12.9116, longitude: 77.6389 },
  { name: 'BTM Layout', area: 'Stage 2, Bengaluru', latitude: 12.9166, longitude: 77.6101 },
  { name: 'Koramangala', area: '5th Block, Bengaluru', latitude: 12.9352, longitude: 77.6245 },
  { name: 'Indiranagar', area: '100 Feet Road, Bengaluru', latitude: 12.9784, longitude: 77.6408 },
  { name: 'Electronic City', area: 'Phase 1, Bengaluru', latitude: 12.8399, longitude: 77.6680 },
  { name: 'Shanthinagar', area: 'Central Bengaluru', latitude: 12.9565, longitude: 77.5925 },
];

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  currentLat,
  currentLng,
  onSelectLocation,
}) => {
  const [customLat, setCustomLat] = useState(currentLat.toString());
  const [customLng, setCustomLng] = useState(currentLng.toString());
  const [customName, setCustomName] = useState('Custom Location');
  const [isDetecting, setIsDetecting] = useState(false);

  if (!isOpen) return null;

  const handleUseGeolocation = () => {
    setIsDetecting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsDetecting(false);
          onSelectLocation(
            position.coords.latitude,
            position.coords.longitude,
            'Live GPS Location'
          );
          onClose();
        },
        (error) => {
          setIsDetecting(false);
          alert('Could not retrieve your GPS location. Using default coordinates.');
        },
        { timeout: 8000 }
      );
    } else {
      setIsDetecting(false);
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleCustomApply = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lng = parseFloat(customLng);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      alert('Please enter valid latitude (-90 to 90) and longitude (-180 to 180)');
      return;
    }
    onSelectLocation(lat, lng, customName || `${lat.toFixed(3)}, ${lng.toFixed(3)}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Select Delivery Location</h3>
              <p className="text-xs text-slate-500 font-medium">QEats calculates nearby restaurants based on coordinates</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">

          {/* GPS Auto Detect */}
          <button
            onClick={handleUseGeolocation}
            disabled={isDetecting}
            id="use-geolocation-btn"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 transition-colors shadow-sm"
          >
            <Navigation className={`w-4 h-4 ${isDetecting ? 'animate-spin' : ''}`} />
            <span>{isDetecting ? 'Detecting Location...' : 'Use Current Device Location'}</span>
          </button>

          {/* Preset Locations */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Popular Locations (Bengaluru)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRESET_LOCATIONS.map((loc) => {
                const isSelected =
                  Math.abs(loc.latitude - currentLat) < 0.005 &&
                  Math.abs(loc.longitude - currentLng) < 0.005;

                return (
                  <button
                    key={loc.name}
                    onClick={() => {
                      onSelectLocation(loc.latitude, loc.longitude, loc.name);
                      onClose();
                    }}
                    className={`flex items-start justify-between p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-rose-50 border-rose-500 text-rose-900 shadow-sm'
                        : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-sm">{loc.name}</p>
                      <p className="text-xs text-slate-500">{loc.area}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                        {loc.latitude}, {loc.longitude}
                      </p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Coordinates Input */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Custom Lat / Long Coordinates</span>
            </h4>
            <form onSubmit={handleCustomApply} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Latitude (-90 to 90)</label>
                  <input
                    type="number"
                    step="any"
                    value={customLat}
                    onChange={(e) => setCustomLat(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    placeholder="12.9116"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Longitude (-180 to 180)</label>
                  <input
                    type="number"
                    step="any"
                    value={customLng}
                    onChange={(e) => setCustomLng(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    placeholder="77.6389"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Location Label</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  placeholder="e.g. Home, Office"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-colors shadow-md"
              >
                Set Custom Coordinates
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
