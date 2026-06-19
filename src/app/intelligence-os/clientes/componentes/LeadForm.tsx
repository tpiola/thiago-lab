'use client';

/* ==========================================================================
   LeadForm — Formulário de lead com validação client-side
   Envia para /api/n8n/leads (POST) que dispara n8n webhook + Supabase
   Intelligence OS — thiagolab.com
   ========================================================================== */

import { useState, useCallback } from 'react';
import { X, Check, Loader2, AlertCircle, Send } from 'lucide-react';

/* ─── Tipos ──────────────────────────────────────────────────────── */

interface LeadFormData {
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  mensagem: string;
}

interface FormErrors {
  nome?: string;
  email?: string;
  telefone?: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

/* ─── Validação ──────────────────────────────────────────────────── */

function validate(data: LeadFormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.nome.trim()) {
    errors.nome = 'Nome é obrigatório';
  } else if (data.nome.trim().length < 2) {
    errors.nome = 'Nome deve ter pelo menos 2 caracteres';
  }

  if (!data.email.trim()) {
    errors.email = 'Email é obrigatório';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Email inválido';
  }

  if (data.telefone && data.telefone.replace(/\D/g, '').length < 10) {
    errors.telefone = 'Telefone deve ter pelo menos 10 dígitos';
  }

  return errors;
}

function hasErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0;
}

/* ─── Mask para telefone ──────────────────────────────────────────── */

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/* ═══════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

interface LeadFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function LeadForm({ open, onClose, onSuccess }: LeadFormProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    nome: '',
    email: '',
    telefone: '',
    empresa: '',
    mensagem: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [serverError, setServerError] = useState('');

  /* ─── Handlers ─────────────────────────────────────────────────── */

  const handleChange = useCallback(
    (field: keyof LeadFormData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value =
          field === 'telefone'
            ? maskPhone(e.target.value)
            : e.target.value;

        setFormData((prev) => ({ ...prev, [field]: value }));

        // Limpar erro do campo ao digitar
        if (errors[field as keyof FormErrors]) {
          setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
        if (status === 'error') setServerError('');
      },
    [errors, status],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const validationErrors = validate(formData);
      setErrors(validationErrors);

      if (hasErrors(validationErrors)) return;

      setStatus('submitting');
      setServerError('');

      try {
        const res = await fetch('/api/n8n/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok || data.error) {
          setStatus('error');
          setServerError(data.error || 'Erro ao cadastrar lead.');
          return;
        }

        setStatus('success');

        // Reset form after 2s and close
        setTimeout(() => {
          setFormData({ nome: '', email: '', telefone: '', empresa: '', mensagem: '' });
          setStatus('idle');
          setErrors({});
          onSuccess?.();
          onClose();
        }, 2000);
      } catch (err) {
        setStatus('error');
        setServerError('Erro de conexão. Verifique sua internet e tente novamente.');
      }
    },
    [formData, onClose, onSuccess],
  );

  const handleClose = useCallback(() => {
    if (status === 'submitting') return; // Não fecha durante envio
    setFormData({ nome: '', email: '', telefone: '', empresa: '', mensagem: '' });
    setErrors({});
    setStatus('idle');
    setServerError('');
    onClose();
  }, [onClose, status]);

  if (!open) return null;

  /* ─── Render ─────────────────────────────────────────────────────── */

  const inputClass =
    'intelligence-os-input w-full text-sm py-2.5 px-3 transition-all duration-200 ' +
    'placeholder:text-[#4B5563]';

  const errorClass = 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20';

  return (
    <div
      className="intelligence-os-modal-overlay"
      onClick={handleClose}
      style={{ zIndex: 100 }}
    >
      <div
        className="intelligence-os-modal max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[rgba(201,162,39,0.1)] border border-[rgba(201,162,39,0.12)] flex items-center justify-center">
              <Send size={16} className="text-[#C9A227]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#E8EDF2] font-['Clash_Display',system-ui,sans-serif]">
                {status === 'success' ? 'Lead Cadastrado!' : 'Novo Lead'}
              </h2>
              <p className="text-[11px] text-[#6B7280] mt-0.5">
                {status === 'success'
                  ? 'Lead registrado com sucesso'
                  : 'Preencha os dados para cadastrar um novo lead'}
              </p>
            </div>
          </div>
          {status !== 'submitting' && (
            <button
              onClick={handleClose}
              className="p-1.5 text-[#6B7280] hover:text-[#E8EDF2] hover:bg-[rgba(201,162,39,0.06)] rounded-lg transition-all"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* ── Success State ────────────────────────────────────────────── */}
        {status === 'success' ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-14 h-14 rounded-full bg-[rgba(52,211,153,0.1)] border border-[rgba(52,211,153,0.15)] flex items-center justify-center mb-4">
              <Check size={24} className="text-[#34D399]" />
            </div>
            <p className="text-sm font-medium text-[#E8EDF2]">Lead cadastrado com sucesso!</p>
            <p className="text-xs text-[#6B7280] mt-1">
              Os dados foram enviados para o CRM e n8n.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* ── Nome ──────────────────────────────────────────────── */}
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1.5">
                Nome Completo <span className="text-red-400">*</span>
              </label>
              <input
                className={`${inputClass} ${errors.nome ? errorClass : ''}`}
                placeholder="Ex: João Silva"
                value={formData.nome}
                onChange={handleChange('nome')}
                disabled={status === 'submitting'}
                autoFocus
              />
              {errors.nome && (
                <p className="flex items-center gap-1 text-[11px] text-red-400 mt-1">
                  <AlertCircle size={10} />
                  {errors.nome}
                </p>
              )}
            </div>

            {/* ── Email ──────────────────────────────────────────────── */}
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1.5">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                className={`${inputClass} ${errors.email ? errorClass : ''}`}
                placeholder="email@exemplo.com"
                value={formData.email}
                onChange={handleChange('email')}
                disabled={status === 'submitting'}
              />
              {errors.email && (
                <p className="flex items-center gap-1 text-[11px] text-red-400 mt-1">
                  <AlertCircle size={10} />
                  {errors.email}
                </p>
              )}
            </div>

            {/* ── Telefone + Empresa ────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Telefone</label>
                <input
                  className={`${inputClass} ${errors.telefone ? errorClass : ''}`}
                  placeholder="(11) 99999-0000"
                  value={formData.telefone}
                  onChange={handleChange('telefone')}
                  disabled={status === 'submitting'}
                />
                {errors.telefone && (
                  <p className="flex items-center gap-1 text-[11px] text-red-400 mt-1">
                    <AlertCircle size={10} />
                    {errors.telefone}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Empresa</label>
                <input
                  className={inputClass}
                  placeholder="Ex: TechStart"
                  value={formData.empresa}
                  onChange={handleChange('empresa')}
                  disabled={status === 'submitting'}
                />
              </div>
            </div>

            {/* ── Mensagem ──────────────────────────────────────────── */}
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Mensagem</label>
              <textarea
                className={`${inputClass} resize-none min-h-[72px]`}
                placeholder="Como podemos ajudar? (opcional)"
                value={formData.mensagem}
                onChange={handleChange('mensagem')}
                disabled={status === 'submitting'}
                rows={3}
              />
            </div>

            {/* ── Server Error ────────────────────────────────────────── */}
            {serverError && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                <span className="text-xs text-red-300">{serverError}</span>
              </div>
            )}

            {/* ── Actions ────────────────────────────────────────────── */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[rgba(201,162,39,0.06)]">
              <button
                type="button"
                onClick={handleClose}
                disabled={status === 'submitting'}
                className="intelligence-os-btn-outline text-xs px-4 py-2 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="intelligence-os-btn-primary text-xs px-5 py-2 disabled:opacity-70 min-w-[130px] justify-center"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    Salvar Lead
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
