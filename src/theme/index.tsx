import { CSSProperties } from 'react';

export type TypographyVariant =
  | 'caption'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2';

type TypographyVariantMap = { [key in TypographyVariant]: CSSProperties };

export type BlockTrekkerTheme = { typography: TypographyVariantMap };

export const typography: TypographyVariantMap = {
  caption: {
    fontFamily: 'montserrat',
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '14px',
  },
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
  h6: {
    fontFamily: 'Heebo',
    fontSize: '20px',
    fontWeight: 500,
    letterSpacing: '0.5px',
    lineHeight: '24px',
  },
  subtitle1: {
    fontFamily: 'Heebo',
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '18px',
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
