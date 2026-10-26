import { setRequestLocale } from 'next-intl/server';
import { RegisterView } from '@/components/loyalty/RegisterView';

export default function RegisterPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <RegisterView />;
}
