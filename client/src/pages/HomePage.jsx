import React from 'react';
import { Link } from 'react-router-dom';
import AlbumHero from '../components/AlbumHero';
import AmmuAIAssistant from '../components/AmmuAIAssistant';
import InteractiveShowroom from '../components/InteractiveShowroom';
import PhotoEditorModal from '../components/PhotoEditorModal';
import { Upload, BookOpen, Sparkles, ArrowRight, ShieldCheck, Heart, Award } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="space-y-16">
      
      {/* 1. New Album Creator Hero */}
      <AlbumHero />

      {/* 2. Quick Album Creation CTA Banner */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="glass-panel-gold p-8 rounded-3xl border border-amber-400/40 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="badge-gold">CREATE MEMORY ALBUMS</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Create Your Photo Album in 3 Simple Steps
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Upload your favourite photos ➔ Customise title & page sequence ➔ Preview live album & place order!
            </p>

            <div className="pt-2 flex justify-center">
              <Link to="/create-album" className="btn-primary py-4 px-9 text-sm font-bold shadow-xl">
                <Upload className="w-5 h-5" />
                <span>CREATE YOUR ALBUM NOW</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. AI Female Assistant Feature Showcase */}
      <section className="max-w-5xl mx-auto px-4">
        <AmmuAIAssistant />
      </section>

      {/* 4. Frame & Album Gallery Showroom */}
      <InteractiveShowroom />

      {/* 5. Live Customizer Modal */}
      <PhotoEditorModal />

    </div>
  );
};

export default HomePage;
