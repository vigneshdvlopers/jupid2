"use client";

export const dynamic = "force-dynamic";
import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const handleLogin = () => {
    window.location.href = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/auth/google';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Visual elements */}
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-accent2/20 rounded-full blur-[100px]" />

      <Link href="/" className="mb-12 group flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors">
        <ArrowLeft size={18} />
        <span className="font-semibold text-sm tracking-tight">Back to landing</span>
      </Link>

      <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-top-4 duration-500">
        <Card className="shadow-2xl bg-surface/60 backdrop-blur-xl border-border-custom/50 text-center" padding={false}>
          <div className="p-10 space-y-8">
            <div className="space-y-3">
              <h1 className="text-4xl font-black bg-gradient-primary bg-clip-text text-transparent tracking-tighter">
                Jupid AI
              </h1>
              <p className="text-text-secondary font-medium">
                Sign in to your dashboard
              </p>
            </div>

            <Button size="lg" onClick={handleLogin} className="w-full h-14 font-bold text-lg">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-3 bg-white p-0.5 rounded-sm" />
              Continue with Google
            </Button>

            <div className="pt-4 border-t border-border-custom text-xs text-text-muted leading-relaxed">
              By continuing, you agree to Jupid AI's <a href="#" className="underline hover:text-text-secondary">Terms of Service</a> and <a href="#" className="underline hover:text-text-secondary">Privacy Policy</a>.
            </div>
          </div>
        </Card>
      </div>

      <p className="mt-12 text-sm text-text-muted flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
        Systems Operational
      </p>
    </div>
  );
}
