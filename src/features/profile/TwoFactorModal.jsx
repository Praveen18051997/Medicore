import { useState } from 'react';
import { ShieldCheck, Copy, Check, QrCode } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

export default function TwoFactorModal({ isOpen, onClose, isEnabled, onToggle2FA }) {
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const secretKey = 'MEDICORE-AUTH-9823-X91A';

  const handleCopy = () => {
    navigator.clipboard?.writeText(secretKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCodeChange = (index, value) => {
    if (value.length > 1) value = value[0];
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      document.getElementById(`2fa-input-${index + 1}`)?.focus();
    }
  };

  const handleConfirm = () => {
    onToggle2FA(!isEnabled);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEnabled ? 'Disable 2-Factor Authentication' : 'Setup 2-Factor Authentication'}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant={isEnabled ? 'danger' : 'primary'} onClick={handleConfirm}>
            {isEnabled ? 'Turn Off 2FA' : 'Enable 2FA Protection'}
          </Button>
        </>
      }
    >
      {isEnabled ? (
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 rounded-full bg-danger-500/10 text-danger-500 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-base font-bold text-surface-900 dark:text-surface-100">Disable 2-Factor Security?</h4>
            <p className="text-sm text-surface-500 mt-1">
              Disabling 2FA will lower your account security score. You will no longer be asked for an authenticator token during login.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-primary-900 dark:text-primary-200 leading-relaxed">
              Scan this QR code with an authenticator app (Google Authenticator, Authy, or 1Password) to secure your MediCore account.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center bg-surface-50 dark:bg-surface-800/40 p-4 rounded-2xl">
            {/* SVG Simulated QR Code */}
            <div className="bg-white p-3 rounded-xl shadow-md border border-surface-200 text-center">
              <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" rx="8" fill="white" />
                <rect x="10" y="10" width="30" height="30" fill="#0f172a" />
                <rect x="15" y="15" width="20" height="20" fill="white" />
                <rect x="20" y="20" width="10" height="10" fill="#0f172a" />
                
                <rect x="60" y="10" width="30" height="30" fill="#0f172a" />
                <rect x="65" y="15" width="20" height="20" fill="white" />
                <rect x="70" y="20" width="10" height="10" fill="#0f172a" />
                
                <rect x="10" y="60" width="30" height="30" fill="#0f172a" />
                <rect x="15" y="65" width="20" height="20" fill="white" />
                <rect x="20" y="70" width="10" height="10" fill="#0f172a" />
                
                <rect x="50" y="50" width="15" height="15" fill="#0f172a" />
                <rect x="70" y="50" width="20" height="10" fill="#0f172a" />
                <rect x="50" y="70" width="10" height="20" fill="#0f172a" />
                <rect x="70" y="70" width="20" height="20" fill="#0f172a" />
              </svg>
              <span className="text-[10px] text-surface-400 font-mono mt-1 block">SCAN ME</span>
            </div>

            <div className="space-y-3 flex-1">
              <div>
                <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Secret Setup Key</p>
                <div className="flex items-center gap-2 mt-1 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 px-3 py-2 rounded-xl">
                  <span className="text-xs font-mono font-bold text-surface-800 dark:text-surface-200 truncate">{secretKey}</span>
                  <button onClick={handleCopy} className="p-1 text-surface-400 hover:text-primary-500 transition-colors ml-auto">
                    {copied ? <Check className="w-4 h-4 text-accent-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-2">
              Enter 6-Digit Code from App
            </label>
            <div className="flex gap-2 justify-center">
              {code.map((digit, i) => (
                <input
                  key={i}
                  id={`2fa-input-${i}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(i, e.target.value)}
                  className="w-10 h-12 text-center text-lg font-bold bg-surface-50 dark:bg-surface-800 border border-surface-300 dark:border-surface-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
