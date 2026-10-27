// The people behind the store, as the owner listed them on 2026-10-27. There are no portraits yet: each one shows a
// placeholder until `photo` points at a picture under public/ (see docs/content-placeholders.md).

export interface TeamMember {
  /** The portrait's in-page anchor, #team-<id>. */
  id: string;
  name: string;
  role: string;
  /** A portrait under public/, 4:5, once the owner sends one. */
  photo?: string;
}

export const TEAM: TeamMember[] = [
  { id: 'lily', name: 'Lily Xie', role: 'Chief Executive Officer · Founder' },
  { id: 'chiwai', name: 'Chiwai Chung', role: 'Chief Financial Officer · Co-Founder' },
  { id: 'chakho', name: 'Chakho Chung', role: 'Chief Technology Officer' },
  { id: 'chingho', name: 'Chingho Chung', role: 'Chief Operating Officer' },
  { id: 'bob', name: 'Bob Chung', role: 'Chief Design Officer' },
];
