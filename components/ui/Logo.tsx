import { clsx } from '@/lib/clsx';

/** Sun meeting the horizon: two halves of one disc with a gap between them. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={clsx('inline-block size-6 shrink-0 rounded-full', className)}
      style={{
        background:
          'linear-gradient(180deg, var(--color-leaf-300) 0%, var(--color-leaf-400) 52%, transparent 52%, transparent 61%, var(--color-leaf-600) 61%, var(--color-leaf-700) 100%)',
        boxShadow: '0 0 18px -4px color-mix(in oklab, var(--color-leaf-400) 70%, transparent)',
      }}
    />
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={clsx('flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="font-display text-[1.15rem] font-semibold tracking-[-0.03em] text-bone">
        Jontai<span className="font-normal text-mist"> Energy</span>
      </span>
    </span>
  );
}
