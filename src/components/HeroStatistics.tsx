import React from 'react';
import { Target, Activity, Award, TrendingUp, Radio } from 'lucide-react';
import { Signal } from '../types';

interface HeroStatisticsProps {
  completedHistory: Signal[];
  activeSignalsCount: number;
  onGenerateClick?: () => void;
  isGenerating?: boolean;
}

export function HeroStatistics({ completedHistory, activeSignalsCount, onGenerateClick, isGenerating }: HeroStatisticsProps) {
  const total = completedHistory.length;
  const wins = completedHistory.filter((s) => s.status === "won" || (s as any).result === "ربح").length;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 100;
  
  // Calculate average confidence
  const avgConfidence = total > 0 
    ? Math.round(completedHistory.reduce((acc, curr) => acc + curr.strength, 0) / total)
    : 80;

  const totalSignals = total + activeSignalsCount;

  return (
    <div className="space-y-4 mb-8 w-full max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-theme-deep border border-purple-500/20 rounded-3xl p-8 text-center relative overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.1)]">
        {/* Glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[600px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-emerald-400 font-medium text-sm">نظام التحليل التلقائي يعمل</span>
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
            <span className="text-white">إشارات </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500">حقيقية ومدروسة</span>
            <br />
            <span className="text-white">للأصول وأزواج OTC</span>
          </h2>

          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed mb-8">
            تحليل مباشر بأحدث التقنيات الأوروبية للسكالبنج – كشف السيولة، النماذج، وتحليل الاتجاه مع إرسال تلقائي للإشارات
          </p>

          <button 
            onClick={onGenerateClick}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-2xl font-bold text-lg hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 min-w-[280px]"
          >
            <Radio className="w-5 h-5 animate-pulse" />
            <span>تحليل وإرسال إشارة جديدة</span>
          </button>
        </div>
      </div>

      {/* 4 Grid Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total Signals */}
        <div className="bg-theme-deep border border-purple-500/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-theme-card transition-colors">
          <div className="w-12 h-12 bg-fuchsia-500 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(217,70,239,0.3)]">
            <Target className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl md:text-3xl font-black text-white font-mono mb-1">{totalSignals}</span>
          <span className="text-slate-400 text-sm">إجمالي الإشارات</span>
        </div>

        {/* Active Signals */}
        <div className="bg-theme-deep border border-purple-500/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-theme-card transition-colors">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl md:text-3xl font-black text-white font-mono mb-1">{activeSignalsCount}</span>
          <span className="text-slate-400 text-sm">إشارات نشطة</span>
        </div>

        {/* Win Rate */}
        <div className="bg-theme-deep border border-purple-500/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-theme-card transition-colors">
          <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
            <Award className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl md:text-3xl font-black text-white font-mono mb-1">{winRate}%</span>
          <span className="text-slate-400 text-sm">نسبة النجاح</span>
        </div>

        {/* Avg Confidence */}
        <div className="bg-theme-deep border border-purple-500/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-theme-card transition-colors">
          <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl md:text-3xl font-black text-white font-mono mb-1">{avgConfidence}%</span>
          <span className="text-slate-400 text-sm">متوسط الثقة</span>
        </div>
      </div>
    </div>
  );
}
