import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  ChefHat, 
  Bike, 
  Home, 
  Clock, 
  Phone, 
  MessageSquare, 
  Star, 
  Sparkles, 
  Play 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function OrderTracker({ order }) {
  const { t } = useLanguage();
  const [currentStageIndex, setCurrentStageIndex] = useState(1); // 0 to 3

  const STAGES = [
    {
      id: 1,
      title: t('order_stage_1_title', 'Order Confirmed'),
      subtitle: t('order_stage_1_sub', 'Kitchen received your order'),
      icon: CheckCircle2,
      eta: '25 min'
    },
    {
      id: 2,
      title: t('order_stage_2_title', 'Chef Preparing'),
      subtitle: t('order_stage_2_sub', 'Fresh ingredients sizzling on the grill'),
      icon: ChefHat,
      eta: '18 min'
    },
    {
      id: 3,
      title: t('order_stage_3_title', 'Courier on the Way'),
      subtitle: t('order_stage_3_sub', 'Speeding towards your address'),
      icon: Bike,
      eta: '8 min'
    },
    {
      id: 4,
      title: t('order_stage_4_title', 'Arrived & Delivered'),
      subtitle: t('order_stage_4_sub', 'Bon Appetit! Enjoy your feast'),
      icon: Home,
      eta: '0 min'
    }
  ];

  useEffect(() => {
    // Auto advance stage every 9 seconds for a lively simulation
    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 9000);
    return () => clearInterval(interval);
  }, [STAGES.length]);

  const progressPercentage = ((currentStageIndex) / (STAGES.length - 1)) * 100;

  return (
    <div className="space-y-6">
      
      {/* Estimated Time Header */}
      <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] uppercase font-bold text-stone-400">{t('order_est_delivery', 'Estimated Delivery')}</div>
            <div className="text-lg font-bold font-mono text-white">
              {STAGES[currentStageIndex].eta} ({order?.estimatedArrival || '20-30 min'})
            </div>
          </div>
        </div>

        <button
          onClick={() => setCurrentStageIndex((prev) => (prev + 1) % STAGES.length)}
          className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-400 text-xs font-bold flex items-center gap-1.5 transition-colors"
          title="Simulate courier progress"
        >
          <Play className="w-3 h-3 fill-amber-400" />
          <span>{t('order_advance_step', 'Advance Step')}</span>
        </button>
      </div>

      {/* Progress Bar & Animated Rider Icon */}
      <div className="relative px-2 py-4">
        {/* Track Line Background */}
        <div className="h-2 w-full bg-stone-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>

        {/* Animated Moving Scooter Icon */}
        <motion.div
          className="absolute -top-3 text-amber-400"
          initial={{ left: '0%' }}
          animate={{ left: `calc(${progressPercentage}% - 14px)` }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-7 h-7 rounded-full bg-stone-950 border-2 border-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Bike className="w-4 h-4 text-amber-400" />
          </div>
        </motion.div>

        {/* Step Nodes */}
        <div className="flex justify-between items-center mt-5">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx <= currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const Icon = stage.icon;

            return (
              <div key={stage.id} className="flex flex-col items-center text-center max-w-[70px]">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-amber-500 text-stone-950 scale-110 shadow-lg shadow-amber-500/30'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-stone-900 text-stone-600 border border-stone-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[10px] mt-1.5 font-bold ${isCurrent ? 'text-amber-400' : isCompleted ? 'text-stone-300' : 'text-stone-600'}`}>
                  {stage.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Driver Card */}
      <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
            alt="Delivery Driver"
            className="w-12 h-12 rounded-2xl object-cover border border-amber-500/30"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white">Marco Rivera</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.2 rounded flex items-center gap-0.5 font-bold">
                <Star className="w-3 h-3 fill-amber-400" /> 4.98
              </span>
            </div>
            <p className="text-xs text-stone-400">Electric Vespa • Red Helmet</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Calling driver Marco: (555) 019-2834')}
            className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 transition-colors"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            onClick={() => alert('Message sent to courier: "Gate code is #402"')}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-colors shadow-md"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}

