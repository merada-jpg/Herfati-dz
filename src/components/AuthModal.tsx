import React, { useState } from 'react';
import { signIn, signUp } from '../services/auth';

type Props = {
  language: 'ar' | 'fr';
  onClose: () => void;
};

export const AuthModal = ({ language, onClose }: Props) => {
  const ar = language === 'ar';
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const submit = async () => {
    setMessage('');
    if (!email.trim() || password.length < 8 || (mode === 'signup' && !name.trim())) {
      setMessage(ar ? 'أدخل البيانات المطلوبة، وكلمة المرور 8 أحرف على الأقل.' : 'Veuillez remplir les champs requis; mot de passe: 8 caractères minimum.');
      return;
    }
    setBusy(true);
    const result = mode === 'signin'
      ? await signIn(email.trim(), password)
      : await signUp(email.trim(), password, name.trim());
    setBusy(false);
    if (result.error) {
      setMessage(result.error);
      return;
    }
    if ('needsEmailConfirmation' in result && result.needsEmailConfirmation) {
      setMessage(ar ? 'تم إنشاء الحساب. تحقق من بريدك الإلكتروني لتفعيل الدخول.' : 'Compte créé. Vérifiez votre e-mail pour confirmer votre compte.');
      return;
    }
    onClose();
  };

  return <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold">{mode === 'signin' ? (ar ? 'تسجيل الدخول' : 'Connexion') : (ar ? 'إنشاء حساب' : 'Créer un compte')}</h2>
        <button onClick={onClose} className="text-stone-500">{ar ? 'إغلاق' : 'Fermer'}</button>
      </div>
      {mode === 'signup' && <input value={name} onChange={e => setName(e.target.value)} placeholder={ar ? 'الاسم الكامل' : 'Nom complet'} className="w-full border rounded-lg p-3 mb-3" autoComplete="name" />}
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" className="w-full border rounded-lg p-3 mb-3" autoComplete="email" />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder={ar ? 'كلمة المرور' : 'Mot de passe'} type="password" className="w-full border rounded-lg p-3 mb-3" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} />
      {message && <p className="text-sm text-red-700 mb-3" role="alert">{message}</p>}
      <button disabled={busy} onClick={submit} className="w-full bg-stone-900 text-white rounded-lg py-3 disabled:opacity-50">{busy ? (ar ? 'جارٍ المعالجة...' : 'Traitement...') : (mode === 'signin' ? (ar ? 'دخول' : 'Se connecter') : (ar ? 'إنشاء الحساب' : 'Créer le compte'))}</button>
      <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setMessage(''); }} className="w-full mt-3 text-sm underline">
        {mode === 'signin' ? (ar ? 'ليس لديك حساب؟ إنشاء حساب' : 'Pas de compte ? Créer un compte') : (ar ? 'لديك حساب؟ تسجيل الدخول' : 'Déjà un compte ? Se connecter')}
      </button>
    </div>
  </div>;
};
