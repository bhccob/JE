import { setRequestLocale } from 'next-intl/server';
import { LoginView } from '@/components/loyalty/LoginView';

export default function LoginPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <LoginView />;
}
