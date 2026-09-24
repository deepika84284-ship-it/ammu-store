import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Globe, Sparkles, MessageCircle, X, ChevronRight, Send } from 'lucide-react';

const TAMIL_SPEECH = `Hi! Welcome to AMMU Frame Store. ❤️

இந்த frame உங்களுடைய beautiful memories-க்கு ரொம்ப அழகாக இருக்கும்.

உங்க favourite photos-ஐ இங்கே upload பண்ணுங்க.

நீங்க விரும்புற frame, size, design, filter எல்லாம் choose பண்ணிக்கலாம்.

உங்களுக்கு வேண்டிய photos-ஐ upload பண்ணினா, அதை customize பண்ணி beautiful frame-ஆ preview பண்ணிக்கலாம்.

இந்த design உங்களுக்கு பிடிச்சிருந்தா, Order Now கொடுங்க.

உங்க order details எங்களுடைய team-க்கு வரும். நாங்கள் order confirm பண்ணி, frame தயாரித்து உங்களுக்கு delivery பண்ணுவோம்.

Ready-aa? உங்கள் first memory-ஐ upload பண்ணலாம்! ❤️`;

const ENGLISH_SPEECH = `Hi! Welcome to AMMU Frame Store. ❤️

This photo frame will look stunning with your beautiful memories!

Please upload your favorite photo right here.

You can select your preferred frame style, dimensions, lighting filters, and custom captions.

Once you upload, you can immediately preview your live frame.

If you love the preview, simply click Order Now! Our team will carefully construct your frame and deliver it to your address.

Ready? Let’s upload your first memory! ❤️`;

const PREDEFINED_QA = {
  price: "Our custom frames start at just ₹1 for Mini Memories! Classic frames range from ₹99 to ₹599 for grand wedding frames. Prices depend on your selected frame size and material.",
  size: "We offer multiple standard sizes: 4×6 inch, 8×10 inch, 12×18 inch, 16×24 inch, and 20×30 inch gallery canvas.",
  customization: "You can crop, rotate, adjust brightness/contrast, apply Warm/Vintage/B&W filters, and add personalized text overlay on the photo mat!",
  delivery: "Orders are processed within 24 hours. Express delivery takes 2 to 4 business days safely packaged in wooden box casing.",
  order: "Simply upload your photo, pick a frame, fill in your delivery address at checkout, and click Place Order. You will receive real-time order status tracking!"
};

const AmmuAIAssistant = ({ onUploadClick, onOrderClick, currentProduct }) => {
  const [language, setLanguage] = useState('tanglish'); // 'tanglish' | 'english'
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentMessage, setCurrentMessage] = useState(TAMIL_SPEECH);
  const [customQuestion, setCustomQuestion] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    setCurrentMessage(language === 'tanglish' ? TAMIL_SPEECH : ENGLISH_SPEECH);
  }, [language]);

  const speakMessage = (text) => {
    if (!('speechSynthesis' in window) || isMuted) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.1; // Friendly female voice pitch
    utterance.lang = language === 'tanglish' ? 'ta-IN' : 'en-US';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSpeechToggle = () => {
    if (isMuted) {
      setIsMuted(false);
      speakMessage(currentMessage);
    } else {
      setIsMuted(true);
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleAction = (actionKey) => {
    let responseText = '';

    switch (actionKey) {
      case 'customize':
        responseText = "Click the '+ Upload Photo' button to open our live photo editor. You can apply warm filters, rotate, and add custom text!";
        if (onUploadClick) onUploadClick();
        break;
      case 'frames':
        responseText = "We have 10+ handcrafted frame designs including Classic Oak, Royal Gold Filigree, Deep Mahogany, and Neon Acrylic!";
        break;
      case 'price':
        responseText = currentProduct 
          ? `This "${currentProduct.name}" frame is priced at ₹${currentProduct.price}. We also have ₹1 test products!` 
          : PREDEFINED_QA.price;
        break;
      case 'upload':
        responseText = "Please select any photo (JPG, PNG, WebP) up to 10MB to see live photo frame rendering!";
        if (onUploadClick) onUploadClick();
        break;
      case 'order':
        responseText = "Awesome! Clicking Order Now will save your frame customization directly to our database for admin confirmation.";
        if (onOrderClick) onOrderClick();
        break;
      case 'help':
        responseText = "I'm Ammu, your digital memory assistant! You can ask me about frame sizes, delivery, or pricing anytime.";
        break;
      default:
        responseText = PREDEFINED_QA[actionKey] || "I'm here to help you turn your memories into beautiful frames!";
    }

    setCurrentMessage(responseText);
    if (!isMuted) speakMessage(responseText);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    const query = customQuestion.toLowerCase();
    let reply = "That's a great memory! Our team will ensure high quality printing for your photo frame.";

    if (query.includes('price') || query.includes('cost') || query.includes('rate') || query.includes('₹')) {
      reply = PREDEFINED_QA.price;
    } else if (query.includes('size') || query.includes('inch') || query.includes('dimension')) {
      reply = PREDEFINED_QA.size;
    } else if (query.includes('delivery') || query.includes('ship') || query.includes('days')) {
      reply = PREDEFINED_QA.delivery;
    } else if (query.includes('order') || query.includes('buy')) {
      reply = PREDEFINED_QA.order;
    }

    setCurrentMessage(reply);
    setCustomQuestion('');
    if (!isMuted) speakMessage(reply);
  };

  return (
    <div className="relative w-full glass-panel-gold p-5 rounded-2xl overflow-hidden shadow-2xl border border-amber-400/30">
      
      {/* Background Subtle Sparkle Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-4 mb-4">
        
        {/* Avatar Profile */}
        <div className="flex items-center gap-3">
          <div className="relative">
            {/* Friendly Digital Female Avatar Icon */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-400 via-amber-300 to-amber-500 p-[2px] shadow-lg">
              <div className="w-full h-full bg-[#181324] rounded-full flex items-center justify-center text-xl overflow-hidden relative">
                👩🏻‍🎨
                {isSpeaking && (
                  <span className="absolute inset-0 bg-amber-400/20 animate-ping rounded-full" />
                )}
              </div>
            </div>
            {/* Online Pulse Dot */}
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#181324] rounded-full animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-serif font-bold text-white text-base">Ammu AI</h4>
              <span className="badge-gold text-[9px]">Memory Assistant</span>
            </div>
            <p className="text-[11px] text-amber-200/80">Your Personal Frame Stylist</p>
          </div>
        </div>

        {/* Controls: Audio & Language */}
        <div className="flex items-center gap-2">
          {/* Tamil / English Switch */}
          <button 
            onClick={() => setLanguage(l => l === 'tanglish' ? 'english' : 'tanglish')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-amber-200 hover:bg-white/20 text-xs font-semibold transition-all border border-amber-400/30"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'tanglish' ? 'தமிழ் / Tanglish' : 'English'}</span>
          </button>

          {/* Mute/Unmute */}
          <button 
            onClick={handleSpeechToggle}
            className={`p-2 rounded-full border transition-all ${
              !isMuted 
                ? 'bg-amber-400 text-black border-amber-300 shadow-md animate-pulse' 
                : 'bg-white/10 text-gray-400 border-white/10 hover:text-white'
            }`}
            title={isMuted ? "Enable Voice Assistant" : "Mute Voice Assistant"}
          >
            {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Speech Bubble */}
      <div className="relative bg-[#110e19] rounded-xl p-4 border border-amber-500/20 mb-4 shadow-inner">
        {/* Speaking animation waves */}
        {isSpeaking && (
          <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0s' }} />
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0.15s' }} />
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0.3s' }} />
            <span className="ml-1 text-[11px]">Ammu is speaking...</span>
          </div>
        )}

        <p className="text-xs sm:text-sm text-gray-200 leading-relaxed whitespace-pre-line font-normal">
          {currentMessage}
        </p>
      </div>

      {/* Quick Action Prompt Buttons */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300/70">
          Quick Actions for Ammu:
        </span>

        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => handleAction('customize')}
            className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-amber-400 hover:text-black border border-amber-400/30 text-xs font-medium text-amber-200 transition-all flex items-center gap-1"
          >
            ✨ Customize My Photo
          </button>

          <button 
            onClick={() => handleAction('frames')}
            className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-amber-400 hover:text-black border border-amber-400/30 text-xs font-medium text-amber-200 transition-all flex items-center gap-1"
          >
            🖼️ Show Me Frames
          </button>

          <button 
            onClick={() => handleAction('price')}
            className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-amber-400 hover:text-black border border-amber-400/30 text-xs font-medium text-amber-200 transition-all flex items-center gap-1"
          >
            💰 Show Price
          </button>

          <button 
            onClick={() => handleAction('upload')}
            className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-amber-400 hover:text-black border border-amber-400/30 text-xs font-medium text-amber-200 transition-all flex items-center gap-1"
          >
            📸 Upload Photo
          </button>

          <button 
            onClick={() => handleAction('order')}
            className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-amber-400 hover:text-black border border-amber-400/30 text-xs font-medium text-amber-200 transition-all flex items-center gap-1"
          >
            🛒 Order Now
          </button>

          <button 
            onClick={() => handleAction('help')}
            className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-amber-400 hover:text-black border border-amber-400/30 text-xs font-medium text-amber-200 transition-all flex items-center gap-1"
          >
            ❓ Help
          </button>
        </div>
      </div>

      {/* Input query field */}
      <form onSubmit={handleCustomSubmit} className="mt-4 flex items-center gap-2">
        <input 
          type="text" 
          placeholder="Ask Ammu about prices, delivery, or custom sizes..." 
          value={customQuestion}
          onChange={(e) => setCustomQuestion(e.target.value)}
          className="flex-1 bg-black/40 border border-white/10 rounded-full px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-all"
        />
        <button 
          type="submit" 
          className="p-2 rounded-full bg-amber-400 text-black hover:scale-105 transition-all shadow"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
};

export default AmmuAIAssistant;
