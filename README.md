# AI Unlimited Pro

منصة ذكاء اصطناعي قوية تشبه ChatGPT مع ميزات متقدمة.

## الميزات الحالية

- واجهة عربية فاخرة (RTL) بتصميم حديث
- دعم نماذج متعددة (Groq, OpenRouter, Claude, Gemini, GPT-4o, Grok...)
- Streaming حقيقي للردود
- رفع صور وملفات
- Markdown + Code highlighting
- حفظ المحادثات محلياً (Zustand + localStorage)
- اختيار النموذج من الواجهة
- جاهز للـ Capacitor (APK)

## التشغيل

```bash
npm install
cp .env.example .env.local
# أضف GROQ_API_KEY أو OPENROUTER_API_KEY
npm run dev
```

## المفاتيح المطلوبة

- `GROQ_API_KEY` → مجاني وسريع
- `OPENROUTER_API_KEY` → يفتح عشرات النماذج (Claude, Gemini, GPT...)

## بناء APK

1. انشر الموقع على Vercel
2. روح Actions → Build Android APK → Run workflow
3. حط رابط الموقع
4. نزل الـ Artifact
