import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('common');
  return (
    <main id="main" className="grid min-h-dvh place-items-center px-4">
      <div className="text-center">
        <p className="h-section">{t('notFound')}</p>
        <Link href="/" className="btn btn-primary mt-8">
          {t('backHome')}
        </Link>
      </div>
    </main>
  );
}
