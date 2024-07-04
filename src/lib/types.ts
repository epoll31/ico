export const Sizes = [16, 24, 32, 48, 64, 128, 256] as const;
export type Size = (typeof Sizes)[number];

export type SizedURLs = Partial<Record<Size, string>>;
