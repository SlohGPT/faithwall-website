// Stub. Another branch replaces this whole file at merge; keep the exports and signatures exactly.
export type IllustrationName = string;

export function pickIllustration(slug: string, title: string): IllustrationName | null {
  void slug;
  void title;
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function PostIllustration(_: { slug: string; title: string }): JSX.Element | null {
  return null;
}
