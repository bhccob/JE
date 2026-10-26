export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

export const BUSINESS = {
  name: 'Jontai Energy',
  street: 'Cumana 73',
  city: 'Oranjestad',
  country: 'AW',
  phone: '+297 586 5323',
  whatsapp: 'https://wa.me/2975865323',
  email: 'jontai@qq.com',
} as const;
