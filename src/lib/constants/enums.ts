export type ArkGridAttrType = {
  name: LocalizationName;
};
export const ArkGridAttrTypes = {
  질서: {
    name: {
      ko_kr: '질서',
      en_us: 'Order',
    },
  },
  혼돈: {
    name: {
      ko_kr: '혼돈',
      en_us: 'Chaos',
    },
  },
} as const;
export type ArkGridAttr = keyof typeof ArkGridAttrTypes;
export const ArkGridAttrs = Object.keys(ArkGridAttrTypes) as ArkGridAttr[];

export type LostArkGradeType = {
  name: LocalizationName;
};
export const LostArkGradeTypes = {
  영웅: {
    name: {
      ko_kr: '영웅',
      en_us: 'Epic',
    },
  },
  전설: {
    name: {
      ko_kr: '전설',
      en_us: 'Legendary',
    },
  },
  유물: {
    name: {
      ko_kr: '유물',
      en_us: 'Relic',
    },
  },
  고대: {
    name: {
      ko_kr: '고대',
      en_us: 'Ancient',
    },
  },
} as const;
export type LostArkGrade = keyof typeof LostArkGradeTypes;
export const LostArkGrades = Object.keys(LostArkGradeTypes) as LostArkGrade[];

export const L_DEFAULT_PROFILE_NAME: LocalizationName = {
  ko_kr: '기본',
  en_us: 'Default',
};
export const DEFAULT_PROFILE_NAME = '기본';

export type ScrollCommand = 'top' | 'bottom' | null;

export const DISCORD_URL = 'https://discord.gg/Zk4K3xt9ub';
export const KAKAOTALK_URL = 'https://open.kakao.com/o/s5bTYodi';

// XXX BCP 47에 따르면 ko-kr이 맞다... (https://www.rfc-editor.org/rfc/bcp/bcp47.txt)
export type AppLocale = 'ko_kr' | 'en_us';
export const supportedLocales: AppLocale[] = ['ko_kr', 'en_us'];

export type GemRecognitionLocale = 'ko_kr' | 'en_us' | 'ru_ru';
export const supportedGemRecognitionLocales: GemRecognitionLocale[] = ['ko_kr', 'en_us', 'ru_ru'];

export type LocalizationName = Record<AppLocale, string>;
