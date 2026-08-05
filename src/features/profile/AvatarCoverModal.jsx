import { useState } from 'react';
import { Palette, UserCheck, Check, Upload } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

const BANNERS = [
  { id: 'emerald', name: 'Emerald Care', class: 'from-primary-500 via-primary-600 to-accent-500' },
  { id: 'ocean', name: 'Deep Ocean', class: 'from-blue-600 via-indigo-600 to-cyan-500' },
  { id: 'cyber', name: 'Cyber Teal', class: 'from-teal-500 via-emerald-600 to-sky-600' },
  { id: 'amber', name: 'Sunset Amber', class: 'from-amber-500 via-orange-600 to-rose-500' },
  { id: 'obsidian', name: 'Dark Obsidian', class: 'from-surface-800 via-slate-900 to-surface-700' },
];

const AVATAR_PRESETS = [
  { id: 'doc-m', label: 'Doctor (Male)', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80' },
  { id: 'doc-f', label: 'Doctor (Female)', url: 'https://images.unsplash.com/photo-1594824813566-88855ce78907?w=150&auto=format&fit=crop&q=80' },
  { id: 'specialist', label: 'Specialist', url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80' },
  { id: 'initials', label: 'Monogram (Default Initials)', url: null },
];

export default function AvatarCoverModal({ isOpen, onClose, currentBanner, currentAvatar, onSave }) {
  const [selectedBanner, setSelectedBanner] = useState(currentBanner || BANNERS[0].class);
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || null);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  const handleSave = () => {
    onSave({
      banner: selectedBanner,
      avatar: customAvatarUrl || selectedAvatar,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Customize Cover & Avatar"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save Customization</Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Cover Photo Theme Selection */}
        <div>
          <h4 className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-3 flex items-center gap-2">
            <Palette className="w-4 h-4 text-primary-500" /> Header Cover Gradient
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BANNERS.map((banner) => (
              <button
                key={banner.id}
                type="button"
                onClick={() => setSelectedBanner(banner.class)}
                className={`group relative h-16 rounded-xl overflow-hidden bg-gradient-to-r ${banner.class} border-2 transition-all p-3 flex items-end justify-between text-left ${
                  selectedBanner === banner.class ? 'border-white ring-2 ring-primary-500 scale-[1.02]' : 'border-transparent opacity-85 hover:opacity-100'
                }`}
              >
                <span className="text-xs font-bold text-white shadow-sm drop-shadow">{banner.name}</span>
                {selectedBanner === banner.class && (
                  <span className="w-5 h-5 bg-white text-primary-600 rounded-full flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <hr className="border-surface-200 dark:border-surface-700" />

        {/* Avatar Image Selection */}
        <div>
          <h4 className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-3 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-primary-500" /> Profile Picture Preset
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {AVATAR_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => { setSelectedAvatar(preset.url); setCustomAvatarUrl(''); }}
                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                  selectedAvatar === preset.url && !customAvatarUrl
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-surface-200 dark:border-surface-700 hover:border-surface-300'
                }`}
              >
                {preset.url ? (
                  <img src={preset.url} alt={preset.label} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-sm">
                    PR
                  </div>
                )}
                <span className="text-[11px] font-medium text-surface-700 dark:text-surface-300 text-center leading-tight">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Image URL Input */}
        <div>
          <label className="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1.5 flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" /> Or enter custom Image URL
          </label>
          <input
            type="text"
            placeholder="https://example.com/photo.jpg"
            value={customAvatarUrl}
            onChange={(e) => setCustomAvatarUrl(e.target.value)}
            className="input-field w-full text-xs"
          />
        </div>
      </div>
    </Modal>
  );
}
