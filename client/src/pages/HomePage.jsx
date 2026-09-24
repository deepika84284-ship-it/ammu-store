import React, { useRef } from 'react';
import HeroShowroom from '../components/HeroShowroom';
import InteractiveShowroom from '../components/InteractiveShowroom';
import AmmuAIAssistant from '../components/AmmuAIAssistant';
import PhotoEditorModal from '../components/PhotoEditorModal';

const HomePage = () => {
  const showroomRef = useRef(null);

  const scrollToShowroom = () => {
    showroomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-12">
      {/* 1. Hero Experience */}
      <HeroShowroom onExploreClick={scrollToShowroom} />

      {/* 2. AI Assistant Feature Showcase Banner */}
      <section className="max-w-5xl mx-auto px-4">
        <AmmuAIAssistant />
      </section>

      {/* 3. Interactive Frame Showroom */}
      <InteractiveShowroom showroomRef={showroomRef} />

      {/* 4. Live Customizer Modal */}
      <PhotoEditorModal />
    </div>
  );
};

export default HomePage;
