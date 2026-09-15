import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Heart, CheckCircle2 } from 'lucide-react';
import { REVIEWS } from '../data/foodData';
import { useLanguage } from '../context/LanguageContext';

export default function CustomerReviews() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-stone-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Heart className="w-3.5 h-3.5 fill-amber-400" /> {t('reviews_tag', 'Loved by 50,000+ Foodies')}
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
            {t('reviews_title', 'What Our Diners Are Saying')}
          </h2>
          <p className="text-stone-400 text-sm mt-3">
            {t('reviews_subtitle', 'Real reviews from real food lovers ordering daily across the city.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="p-6 rounded-3xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Star rating */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: review.rating }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <p className="text-stone-300 text-sm leading-relaxed italic mb-6">
                  "{review.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-10 h-10 rounded-full object-cover border border-amber-500/40"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">{review.name}</h4>
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {review.role}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] text-stone-500 font-mono">
                  {review.dish}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

