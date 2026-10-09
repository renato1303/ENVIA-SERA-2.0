import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, ArrowRight } from 'lucide-react';
import { LeadData } from '../types';
import { getResolvedIntegrationsConfig } from '../data';

interface ThankYouPageProps {
  lead?: LeadData;
  calendlyUrl?: string;
  onScheduleCalendly?: () => void;
}

export default function ThankYouPage({ 
  lead, 
  calendlyUrl,
  onScheduleCalendly
}: ThankYouPageProps) {
  const config = getResolvedIntegrationsConfig();

  const CALENDLY_DEFAULT_URL = 'https://calendly.com/comercial-seracacau/30min';
  const targetCalendlyUrl = calendlyUrl || config.calendlyUrl || CALENDLY_DEFAULT_URL;

  // Get user's first name if passed via query params or lead data, defaulting to 'Renato'
  const [userName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const n = params.get('nome') || params.get('name') || '';
      if (n) return n.trim();
    }
    return lead?.nome?.trim() || 'Renato';
  });

  const rawFirstName = userName ? userName.split(' ')[0] : 'Renato';
  const personName = rawFirstName.charAt(0).toUpperCase() + rawFirstName.slice(1);

  // Track conversion on land
  useEffect(() => {
    if ((window as any).fbq && !(window as any).__metaPixelThankYouTracked) {
      try {
        (window as any).fbq('track', 'CompleteRegistration', {
          content_name: 'Página de Obrigado',
          status: true
        });
        (window as any).fbq('track', 'Lead', {
          content_name: 'Lead Página de Obrigado',
          status: true
        });
        (window as any).__metaPixelThankYouTracked = true;
      } catch (e) {
        console.error('Meta pixel error in thank you page:', e);
      }
    }
  }, []);

  const handleCalendlyClick = () => {
    if ((window as any).fbq) {
      try {
        (window as any).fbq('trackCustom', 'AgendarApresentacaoCalendly', {
          content_name: 'Botão A - Agendar Apresentação Calendly'
        });
      } catch (err) {}
    }
    if (onScheduleCalendly) {
      onScheduleCalendly();
    }
  };

  return (
    <motion.div
      key="thank-you-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-xl mx-auto space-y-6 py-4 text-left"
      id="thank-you-view"
    >
      {/* Headline: Recebemos suas informações, Renato. */}
      <h1 className="font-display font-normal text-3xl sm:text-4xl md:text-[44px] text-white tracking-tight leading-[1.15]">
        Recebemos suas<br />
        informações, {personName}.
      </h1>

      {/* Subtitle */}
      <p className="text-neutral-300 font-sans font-light text-[15px] sm:text-base leading-relaxed">
        Última etapa! Clique no botão abaixo para agendar sua consultoria com nosso time:
      </p>

      {/* Botão de Agendamento */}
      <div className="pt-2 space-y-4">
        <a
          href={targetCalendlyUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleCalendlyClick}
          className="group w-full bg-[#C88452] hover:bg-[#B57242] text-white px-6 py-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-between gap-4 cursor-pointer hover:-translate-y-0.5 no-underline text-left font-sans"
          id="btn-calendly-schedule"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <Calendar className="w-5 h-5 text-white shrink-0 drop-shadow-sm" />
            <span className="font-bold text-sm sm:text-base tracking-wide uppercase text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
              Agendar minha consultaria comercial gratuita
            </span>
          </div>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-white group-hover:translate-x-1 transition-all drop-shadow-sm" />
        </a>
      </div>
    </motion.div>
  );
}
