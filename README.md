# Herfati DZ — حِرفتي الجزائر

منصة دليل وخدمات للحرفيين والمهنيين في الجزائر، بواجهة عربية/فرنسية ودعم الولايات والحرف والأسعار الاسترشادية والحجز والتقييمات.

## النسخة المنشورة

تم نشر نسخة Production-Hardened Frontend من أفضل نسخة عملنا عليها، مع إزالة إشارات الثقة المضللة من النموذج الأولي.

### إصلاحات حرجة

- التحقق CAM والتأمين لا يمنحان تلقائياً من واجهة التسجيل.
- الحساب الجديد يبدأ غير موثّق.
- الحجز يبدأ pending ولا يظهر كحجز مؤكد قبل وجود سيرفر حقيقي.
- بيانات الحجز الشخصية تبقى في الذاكرة ولا تحفظ في localStorage.
- التقييمات الجديدة لا تُوسم تلقائياً كحجوزات موثقة.
- بيانات الحرفيين التجريبية لا تحتوي على شارات توثيق مصطنعة.
- صور runtime موجودة في public/images بمسارات ثابتة تعمل مع Vite.
- أضيفت واجهة Red Team توضّح حدود النسخة الحالية.

## طبقة Backend المضافة

أضيفت قاعدة PostgreSQL/RLS أولية في `supabase/migrations/0001_initial.sql`، مع عقود API في `backend/API-CONTRACT.md` وحدود معمارية موثقة في `backend/ARCHITECTURE.md`. هذه الملفات تمثل طبقة الأساس فقط؛ لا تُعتبر بديلاً عن ربط المشروع بمشروع Supabase حقيقي وإعداد المصادقة والخدمات الخلفية.

## تنبيه إنتاجي

هذه النسخة ليست Marketplace إنتاجياً كاملاً بعد. قبل استقبال مستخدمين حقيقيين يجب إضافة:
1. Auth + RBAC/ABAC server-side.
2. PostgreSQL + migrations + constraints.
3. سيرفر تحقق للحرفيين مع audit trail.
4. Booking state machine + idempotency + notifications.
5. مراجعات مرتبطة بحجوزات مكتملة فقط.
6. سياسة خصوصية واحتفاظ وحذف/تصدير البيانات.
7. Rate limiting وmoderation ومكافحة إساءة الاستخدام.
8. اختبارات unit/integration/E2E/accessibility/security.
9. Observability وalerts.
10. حماية فرع الإنتاج وCI إلزامي.

## التشغيل

npm install
npm run dev
npm run lint
npm run build
