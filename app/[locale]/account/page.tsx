import { setRequestLocale } from 'next-intl/server';
import { AccountDashboard } from '@/components/loyalty/AccountDashboard';

export default function AccountPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <AccountDashboard />;
}
