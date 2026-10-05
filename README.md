# Herfati DZ

**حرفتي DZ** — منصة دليل وخدمات للحرفيين والمهنيين في الجزائر.

## الحالة الحالية

هذا المستودع هو نقطة الانطلاق الرسمية لنسخة **Production Hardening**. تم تنفيذ مراجعة REDTEAM/OODA وإزالة عدد من إشارات الثقة المضللة من الواجهة والنماذج الأولية.

> **مهم:** التطبيق الحالي ليس Marketplace إنتاجيًا كاملًا بعد. لا توجد بعد طبقة خادم مكتملة للهوية، الصلاحيات، التحقق، قاعدة البيانات والحجوزات والإشعارات.

## ما تم إصلاحه

- عدم منح التحقق أو التأمين تلقائيًا من واجهة العميل.
- عدم إنشاء تقييم موثّق تلقائيًا.
- الحجز يبدأ كـ `pending` بدل `confirmed`.
- عدم تخزين بيانات الحجز الشخصية في `localStorage`.
- تنظيف ادعاءات التسويق غير القابلة للإثبات.
- تصحيح مسارات الصور لتعمل مع Vite.
- إضافة تحقق آمن للبيانات المقروءة من التخزين.
- إضافة CI أساسي لـ lint/build.
- إضافة سياسة أمنية ومصفوفة Roadmap عبر GitHub Issues.

## بوابة الإنتاج

قبل إعلان المنصة Production، يجب إغلاق عناصر P0/P1 في GitHub، وبالأخص:

1. Auth + RBAC/ABAC.
2. PostgreSQL + migrations + constraints.
3. Server-side artisan verification + audit trail.
4. Booking state machine + idempotency + notifications.
5. Verified reviews based on completed bookings.
6. Privacy/retention/delete/export.
7. Rate limiting + moderation + abuse prevention.
8. Unit/integration/E2E/accessibility/security tests.
9. Observability + alerts.
10. Protected main branch with mandatory CI.

## الجودة

الـ CI موجود في `.github/workflows/ci.yml`. لا نعتبر المشروع Production-ready إلا بعد نجاح الـ quality gates على فرع الإنتاج.

## الوثائق

- `REDTEAM-AUDIT.md` — نتائج التدقيق ونقاط الخطر.
- `PRODUCTION-HARDENING.md` — الإصلاحات المنفذة وما بقي.
- `SECURITY.md` — مبادئ الأمن والإبلاغ عن الثغرات.
