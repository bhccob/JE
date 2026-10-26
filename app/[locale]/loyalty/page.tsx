import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRight, Plus } from '@phosphor-icons/react/dist/ssr';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { PREVIEW_MEMBER, REWARDS, TIERS } from '@/lib/loyalty';
import { SITE_URL } from '@/lib/site';
import { MemberCard } from '@/components/loyalty/MemberCard';
import { LoyaltyHowItWorks } from '@/components/loyalty/LoyaltyHowItWorks';
import { RewardCard } from '@/components/loyalty/RewardCard';
import { TierBadge } from '@/components/loyalty/TierBadge';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('loyaltyTitle'),
    description: t('loyaltyDescription'),
    alternates: { canonical: `/${locale}/loyalty` },
    openGraph: { title: t('loyaltyTitle'), description: t('loyaltyDescription'), images: ['/og.png'] },
  };
}

const FAQ = ['cost', 'earn', 'tiers', 'redeem', 'business'] as const;

export default async function LoyaltyPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('loyalty');
  const c = await getTranslations('circle');

  const offer = {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: 'Jontai Energy — The Circle loyalty program',
    description: 'Earn 1 point per 1 AWG spent, 500 points per referral, and up to 8% back across four tiers.',
    url: `${SITE_URL}/${locale}/loyalty`,
    price: '0',
    priceCurrency: 'AWG',
    eligibleRegion: { '@type': 'Place', name: 'Aruba' },
    seller: { '@type': 'LocalBusiness', name: 'Jontai Energy' },
  };

  return (
    <main id="main" className="overflow-hidden pb-28">
      <section aria-labelledby="circle-title" className="relative pt-[calc(var(--header-h)+56px)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(50% 50% at 80% 20%, rgb(245 166 35 / 0.12), transparent 70%)' }}
        />
        <div className="page-x relative grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <h1 id="circle-title" className="display text-[clamp(3rem,7vw,5.75rem)]">
              {c('heroTitle')}
            </h1>
            <p className="mt-5 font-serif text-[1.5rem] leading-snug tracking-tight text-sun-300">{t('subhead')}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/account/register" className="btn btn-primary">
                {t('join')}
                <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </Link>
              <Link href="/account/login" className="btn btn-ghost">
                {t('login')}
              </Link>
            </div>
          </div>
          <div className="relative lg:col-span-7">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[20px]">
              {/* TODO: replace with a photo of a real member at the counter */}
              <Image src="/media/counter.webp" alt="" fill priority sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night-950/70 via-transparent" />
            </div>
            <div className="absolute -bottom-10 left-4 w-[min(70%,360px)] md:-left-10">
              <MemberCard
                tier={PREVIEW_MEMBER.tier}
                name={PREVIEW_MEMBER.name}
                memberId={PREVIEW_MEMBER.memberId}
                points={PREVIEW_MEMBER.points}
              />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="how-title" className="page-x mt-36 grid gap-12 lg:grid-cols-12">
        <h2 id="how-title" className="h-section lg:col-span-5">
          {t('howTitle')}
        </h2>
        <div className="lg:col-span-6 lg:col-start-7">
          <LoyaltyHowItWorks reveal={false} />
        </div>
      </section>

      <section aria-labelledby="tiers-title" className="page-x mt-32">
        <h2 id="tiers-title" className="h-section">
          {c('tiersTitle')}
        </h2>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((tier) => (
            <li key={tier.id} className="flex flex-col">
              <MemberCard
                tier={tier.id}
                name={tier.tagline}
                points={tier.points === 0 ? 'Free' : tier.points.toLocaleString('en-US')}
                pointsLabel={tier.points === 0 ? undefined : 'pts'}
              />
              <div className="mt-5 flex items-center gap-3">
                <TierBadge tier={tier.id} size="sm" />
                <h3 className="font-serif text-[1.375rem] font-medium tracking-tight text-bone">{tier.name}</h3>
              </div>
              <p className="num mt-1 text-[0.8125rem] text-moss">
                {tier.points === 0 ? '0 pts' : t('from', { points: tier.points.toLocaleString('en-US') })}
              </p>
              <p className="mt-3 text-[0.9375rem] text-mist">
                <span className="sr-only">{c('perk')}: </span>
                {tier.perk}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="rewards-title" className="page-x mt-32">
        <h2 id="rewards-title" className="h-section">
          {t('rewardsTitle')}
        </h2>
        <div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {REWARDS.map((r, k) => (
            <RewardCard key={r.id} reward={r} mode="preview" className={k === 0 ? 'lg:row-span-2' : undefined} />
          ))}
        </div>
      </section>

      <section aria-labelledby="faq-title" className="page-x mt-32 grid gap-10 lg:grid-cols-12">
        <h2 id="faq-title" className="h-section lg:col-span-4">
          {c('faqTitle')}
        </h2>
        <div className="flex flex-col lg:col-span-7 lg:col-start-6">
          {FAQ.map((k) => (
            <details key={k} className="group border-b border-white/10 py-5 first:border-t">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[1.0625rem] font-medium text-bone [&::-webkit-details-marker]:hidden">
                {c(`faq.${k}.q`)}
                <Plus size={18} className="shrink-0 text-mist transition-transform duration-300 group-open:rotate-45" aria-hidden="true" />
              </summary>
              <p className="mt-3 max-w-[60ch] text-mist">{c(`faq.${k}.a`)}</p>
            </details>
          ))}
        </div>
      </section>

      <section aria-labelledby="cta-title" className="page-x mt-32">
        <div
          className="relative overflow-hidden rounded-[20px] border border-sun-400/20 px-6 py-14 md:px-14"
          style={{ background: 'radial-gradient(80% 120% at 100% 0%, rgb(245 166 35 / 0.18), transparent 60%), linear-gradient(160deg, #0f2018, #08130e)' }}
        >
          <h2 id="cta-title" className="h-section max-w-[16ch]">
            {c('ctaTitle')}
          </h2>
          <p className="lede mt-4">{c('ctaBody')}</p>
          <Link href="/account/register" className="btn btn-primary mt-8">
            {t('join')}
            <ArrowRight size={16} weight="bold" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offer) }} />
    </main>
  );
}
