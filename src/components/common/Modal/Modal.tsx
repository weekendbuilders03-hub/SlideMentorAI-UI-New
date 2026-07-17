import React, { useEffect } from 'react';
import { cn } from '../../../utils/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  maxWidth?: string;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, maxWidth = '560px', children, className }) => {
  /* Close on Escape key */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  /* Prevent body scroll when modal is open */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <div
      className={cn('modal-overlay', open ? 'open' : undefined)}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn('modal-card', className)}
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close modal">✕</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
