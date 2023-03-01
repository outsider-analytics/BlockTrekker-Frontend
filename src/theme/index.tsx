import { CSSProperties } from 'react';

export type TypographyVariant = 'h4' | 'h5' | 'subtitle2';

type TypographyVariantMap = { [key in TypographyVariant]: CSSProperties };

export type BlockTrekkerTheme = { typography: TypographyVariantMap };

export const typography: TypographyVariantMap = {
  h4: {
    fontFamily: 'Heebo',
    fontSize: '34px',
    fontWeight: 500,
    letterSpacing: '0.5px',
    lineHeight: '40px',
  },
  h5: {
    fontFamily: 'Heebo',
    fontSize: '24px',
    fontWeight: 500,
    lineHeight: '28px',
  },
  subtitle2: {
    fontFamily: 'Heebo',
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '18px',
  },
};

export const theme: BlockTrekkerTheme = {
  typography,
};
