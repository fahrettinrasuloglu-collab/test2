/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Upload, 
  User, 
  Stethoscope, 
  GraduationCap, 
  Trophy, 
  Dribbble, 
  Cpu, 
  Rocket,
  Plane,
  UtensilsCrossed,
  Scale,
  Aperture,
  Hammer,
  Truck,
  Trash2,
  Shield,
  Flame,
  Loader2,
  RefreshCcw,
  Camera,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type Profession = {
  id: string;
  label: string;
  icon: React.ReactNode;
  prompt: string;
};

const PROFESSIONS: Profession[] = [
  { id: 'doctor', label: 'Doktor', icon: <Stethoscope className="w-6 h-6" />, prompt: 'a highly successful medical doctor in a modern hospital setting' },
  { id: 'footballer', label: 'Futbolcu', icon: <Trophy className="w-6 h-6" />, prompt: 'a legendary professional football player in a packed stadium' },
  { id: 'teacher', label: 'Öğretmen', icon: <GraduationCap className="w-6 h-6" />, prompt: 'an inspiring professor in a high-tech future classroom' },
  { id: 'basketball', label: 'Basketbolcu', icon: <Dribbble className="w-6 h-6" />, prompt: 'a star basketball player in the NBA' },
  { id: 'engineer', label: 'Mühendis', icon: <Cpu className="w-6 h-6" />, prompt: 'a visionary robotics engineer in a futuristic lab' },
  { id: 'astronaut', label: 'Astronot', icon: <Rocket className="w-6 h-6" />, prompt: 'a brave astronaut exploring a new planet' },
  { id: 'chef', label: 'Aşçı', icon: <UtensilsCrossed className="w-6 h-6" />, prompt: 'a world-renowned master chef in a luxury Michelin-star kitchen' },
  { id: 'pilot', label: 'Pilot', icon: <Plane className="w-6 h-6" />, prompt: 'a senior airline captain in the cockpit of a high-tech commercial jet' },
  { id: 'lawyer', label: 'Avukat', icon: <Scale className="w-6 h-6" />, prompt: 'a prestigious and successful lawyer in a high-end law firm or modern courtroom' },
  { id: 'photographer', label: 'Fotoğrafçı', icon: <Aperture className="w-6 h-6" />, prompt: 'a world-famous professional photographer with high-end camera equipment in a beautiful scenic location' },
  { id: 'blacksmith', label: 'Demirci', icon: <Hammer className="w-6 h-6" />, prompt: 'a master blacksmith forging epic steel in a traditional workshop with glowing embers' },
  { id: 'scrapper', label: 'Hurdacı', icon: <Truck className="w-6 h-6" />, prompt: 'a successful recycling entrepreneur managing a high-tech scrap metal yard' },
  { id: 'trash_collector', label: 'Çöpçü', icon: <Trash2 className="w-6 h-6" />, prompt: 'a dedicated environmental sanitation professional in a clean future city' },
  { id: 'police', label: 'Polis', icon: <Shield className="w-6 h-6" />, prompt: 'a brave and respected police officer in a high-tech future police uniform' },
  { id: 'firefighter', label: 'İtfaiyeci', icon: <Flame className="w-6 h-6" />, prompt: 'a heroic firefighter in advanced protective gear in front of a modern fire truck' },
  { id: 'industry', label: 'Sanayi Devrimcisi', icon: <User className="w-6 h-6" />, prompt: 'a powerful industrial leader in a clean-tech factory' },
];

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [profession, setProfession] = useState<Profession | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResultImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateFutureSelf = async () => {
    if (!image || !profession) return;

    setIsGenerating(true);
    setError(null);

    try {
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: `Transform this person into their future self 20 years from now. They should be ${profession.prompt}. Maintain their core facial features but make them look older, more experienced, and dressed in professional attire suitable for the role. The style should be cinematic and high-quality.`,
            },
          ],
        },
      });

      let foundImage = false;
      if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            setResultImage(`data:image/png;base64,${part.inlineData.data}`);
            foundImage = true;
            break;
          }
        }
      }

      if (!foundImage) {
        throw new Error("Görüntü oluşturulamadı. Lütfen tekrar dene.");
      }
    } catch (err) {
      console.error(err);
      setError("Bir hata oluştu. Lütfen tekrar dene veya farklı bir fotoğraf seç.");
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setImage(null);
    setProfession(null);
    setResultImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 overflow-x-hidden">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 relative z-10"
      >
        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-4 text-glow">
          GELECEKTEKİ <span className="text-blue-400">SEN</span>
        </h1>
        <p className="text-white/60 text-lg max-w-md mx-auto">
          Yapay zeka ile 20 yıl sonrasına bir yolculuğa çık. Fotoğrafını yükle ve gelecekteki kariyerini seç.
        </p>
      </motion.header>

      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Left Side: Upload & Selection */}
        <section className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-3xl p-6 md:p-8"
          >
            <h2 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-400" />
              1. Fotoğrafını Yükle
            </h2>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative aspect-square rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center
                ${image ? 'border-blue-400/50' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}`}
            >
              {image ? (
                <>
                  <img src={image} alt="Original" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <RefreshCcw className="w-8 h-8 text-white" />
                  </div>
                </>
              ) : (
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-white/40" />
                  </div>
                  <p className="text-white/60 font-medium">Tıkla veya sürükle bırak</p>
                  <p className="text-white/40 text-sm mt-1">Yüzünün net göründüğü bir fotoğraf seç</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-3xl p-6 md:p-8"
          >
            <h2 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              2. Gelecekteki Mesleğini Seç
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PROFESSIONS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProfession(p)}
                  className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-3 text-sm font-medium
                    ${profession?.id === p.id 
                      ? 'bg-blue-500/20 border-blue-500 text-white' 
                      : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20 hover:text-white'}`}
                >
                  {p.icon}
                  {p.label}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!image || !profession || isGenerating}
            onClick={generateFutureSelf}
            className={`w-full py-5 rounded-2xl font-display font-bold text-lg flex items-center justify-center gap-3 transition-all
              ${!image || !profession || isGenerating 
                ? 'bg-white/5 text-white/20 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40'}`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Zaman Makinesi Çalışıyor...
              </>
            ) : (
              <>
                Geleceğe Git
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </section>

        {/* Right Side: Result */}
        <section className="relative">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="glass rounded-3xl aspect-[3/4] flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="relative w-32 h-32 mb-8">
                  <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-4 border-t-blue-500 rounded-full" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-blue-400 animate-pulse" />
                  </div>
                </div>
                <h3 className="text-2xl font-display font-bold mb-4">Geleceğin Hazırlanıyor</h3>
                <p className="text-white/60">
                  Yapay zeka yüz hatlarını analiz ediyor ve 20 yıl sonrasını hayal ediyor...
                </p>
              </motion.div>
            ) : resultImage ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="glass rounded-3xl overflow-hidden relative aspect-[3/4]">
                  <img 
                    src={resultImage} 
                    alt="Future Self" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-blue-400 font-display font-bold text-sm uppercase tracking-widest mb-2">
                      YIL 2046
                    </p>
                    <h3 className="text-3xl font-display font-bold">
                      Gelecekteki Sen: {profession?.label}
                    </h3>
                  </div>
                </div>
                <button 
                  onClick={reset}
                  className="w-full py-4 glass rounded-2xl font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCcw className="w-5 h-5" />
                  Yeni Bir Gelecek Dene
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-3xl aspect-[3/4] border-white/5 flex flex-col items-center justify-center p-12 text-center text-white/20"
              >
                <div className="w-24 h-24 border-2 border-dashed border-white/10 rounded-full flex items-center justify-center mb-6">
                  <User className="w-12 h-12" />
                </div>
                <p className="text-xl font-display font-medium">Geleceğin Burada Görünecek</p>
                <p className="text-sm mt-2">Soldaki adımları tamamla ve zaman yolculuğuna başla.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center"
            >
              {error}
            </motion.div>
          )}
        </section>
      </main>

      <footer className="mt-16 text-white/20 text-sm flex flex-col items-center gap-4">
        <div className="flex items-center gap-6">
          <span>Gizlilik Odaklı</span>
          <span>•</span>
          <span>Yapay Zeka Destekli</span>
          <span>•</span>
          <span>Eğlence Amaçlıdır</span>
        </div>
        <p>© 2026 Gelecekteki Sen. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}
