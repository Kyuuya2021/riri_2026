'use client';

import { photos } from '@/data/photos';
import PhotoCard from '@/components/PhotoCard';
import { Gift, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Home() {
  const [showGift, setShowGift] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [lightboxAspect, setLightboxAspect] = useState<number | null>(null);

  useEffect(() => {
    if (selectedImage) setLightboxAspect(null);
  }, [selectedImage]);

  return (
    <main className="relative w-full min-h-[100dvh] min-h-screen h-screen max-w-[100vw] bg-[#e6e7e8] overflow-hidden text-[#000000] font-mono selection:bg-yellow-500 selection:text-black">

      <div className="fixed inset-0 opacity-30 pointer-events-none z-0"
           style={{ backgroundImage: `radial-gradient(#999 1px, transparent 1px)`, backgroundSize: '24px 24px' }}>
      </div>

      <div className="absolute top-8 left-0 w-full text-center z-0 pointer-events-none select-none">
        <h1 className="text-5xl sm:text-8xl font-bold tracking-tighter opacity-55 blur-[0.5px] text-[#000000]">
          HAPPY BIRTHDAY
        </h1>
        <p className="mt-4 text-xs tracking-[1em] opacity-80 text-[#000000]">2026.02.02 // MEMORY ARCHIVE</p>
      </div>

      <div className="relative w-full h-full z-10">
        {photos.map((photo, index) => (
          <PhotoCard
            key={photo.id}
            src={photo.src}
            index={index}
            onOpen={(src) => setSelectedImage(src)}
          />
        ))}
      </div>

      <motion.button
        onClick={() => setShowGift(true)}
        className="absolute bottom-8 right-8 z-50 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="relative p-4 bg-black/10 backdrop-blur-md rounded-full border border-black/20 group-hover:bg-yellow-400 group-hover:border-yellow-400 transition-colors duration-300">
          <Gift className="w-6 h-6 text-[#000000] group-hover:text-black transition-colors" />
        </div>
        <span className="absolute -top-10 right-0 text-xs bg-[#000000] text-[#e6e7e8] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Open Gift
        </span>
      </motion.button>

      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 min-h-[100dvh] min-h-[100vh] bg-[#111]">
            {/* ぼかし背景: タップで閉じるのみ */}
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-xl cursor-pointer"
              onClick={() => setSelectedImage(null)}
              aria-label="閉じる"
            />
            {/* 画像の外（余白・すぐ横）をタップしても閉じる */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative z-10 w-full max-w-4xl max-h-[90vh] flex flex-col items-center justify-center cursor-pointer"
              onClick={() => setSelectedImage(null)}
            >
              {/* 画像だけタップで閉じない */}
              <div
                className="relative flex items-center justify-center cursor-default max-w-full max-h-[70vh] sm:max-h-[80vh]"
                onClick={(e) => e.stopPropagation()}
                style={
                  lightboxAspect != null
                    ? { width: '100%', aspectRatio: lightboxAspect, maxHeight: '70vh' }
                    : { width: '100%', minHeight: '40vh' }
                }
              >
                <Image
                  src={selectedImage}
                  alt="Full size memory"
                  fill
                  className="object-contain"
                  sizes="100vw"
                  onLoad={(e) => {
                    const img = e.target as HTMLImageElement;
                    if (img?.naturalWidth && img?.naturalHeight) {
                      setLightboxAspect(img.naturalWidth / img.naturalHeight);
                    }
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showGift && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowGift(false)}
            />
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative bg-[#1a1a1a] border border-white/10 p-8 sm:p-12 max-w-lg w-full shadow-2xl"
            >
              <button onClick={() => setShowGift(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-yellow-400 rounded-full mx-auto flex items-center justify-center mb-4">
                  <Gift className="w-8 h-8 text-black" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-wider text-yellow-400">
                  誕生日メッセージ
                </h2>
                <div className="space-y-4 text-gray-300 leading-relaxed font-light text-sm sm:text-base text-left whitespace-pre-line">
                  <p>りり23歳の誕生日おめでとう。</p>
                  <p>いつも笑顔で、仕事にも何事にも一生懸命なりりを尊敬してるし応援してるよ。</p>
                  <p>今年も辛いことも楽しいこともたくさんあると思うけど、健康第一で前向きに一緒に頑張ろうね！</p>
                  <p>色々なとこに旅行行きたいな！</p>
                  <p>これからもよろしくね</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
