import { BreakPoint } from '../components/PreviewContext';

// 'basic': auto 等の外観には影響はないが、ファイルサイズ等に影響のあるような項目の指定。インポート時に使う
// 'effective': セピア調等の効果を複数の項目に適用する。workbench 上の各項目に適用させることに使う
// 'responsive': １つの項目から画像のサイズ(ピクセル数)が異なる項目を作成する。複数の項目に適用はしない
// 'card': ソーシャルカード(Twitter Card)用にサイズの調整等を行う。'effective' でも良いか?
export type ImportTemplateKind = 'basic' | 'effective' | 'responsive' | 'card';
export type ImportTemplateParameters = { [key: string]: string };
export type ImportTemplateParametersSet = ImportTemplateParameters[];
export type ImportTemplate = {
  kind: ImportTemplateKind[];
  label: string;
  shortDescription?: string;
  parameters: ImportTemplateParametersSet;
  medias: BreakPoint[];
};

export type ImportTemplateList = ImportTemplate[];

export const BuiltinImportTemplate: ImportTemplateList = [
  {
    kind: ['basic'],
    label: 'plain',
    shortDescription: 'auto=compress 指定のみ',
    parameters: [
      {
        auto: 'compress'
      }
    ],
    medias: ['auto', 'auto']
  },
  {
    kind: ['basic', 'effective'],
    label: 'stylize',
    shortDescription: 'blur',
    parameters: [
      {
        auto: 'compress',
        blur: '70'
      }
    ],
    medias: ['auto']
  },
  {
    kind: ['basic', 'effective'],
    label: 'size',
    shortDescription: '画像を 500x300 へサイズ変更',
    parameters: [
      {
        auto: 'compress',
        crop: 'entropy',
        fit: 'crop',
        h: '300',
        w: '500'
      }
    ],
    medias: ['auto']
  },
  {
    kind: ['basic', 'effective'],
    label: 'size',
    shortDescription: '画像を 500x300 へサイズ変更(left)',
    parameters: [
      {
        auto: 'compress',
        crop: 'left',
        fit: 'crop',
        h: '300',
        w: '500'
      }
    ],
    medias: ['auto']
  },
  {
    kind: ['basic', 'effective'],
    label: 'size',
    shortDescription: '画像を 500x300 へサイズ変更(right)',
    parameters: [
      {
        auto: 'compress',
        crop: 'right',
        fit: 'crop',
        h: '300',
        w: '500'
      }
    ],
    medias: ['auto']
  },
  {
    kind: ['basic', 'effective'],
    label: 'size',
    shortDescription: '画像を 500x300 へサイズ変更(entropy)',
    parameters: [
      {
        auto: 'compress',
        crop: 'entropy',
        fit: 'crop',
        h: '300',
        w: '500'
      }
    ],
    medias: ['auto']
  },
  {
    kind: ['basic', 'effective'],
    label: 'stylize',
    shortDescription: 'duotone',
    parameters: [
      {
        auto: 'compress',
        duotone: '000080,FA8072',
        'duotone-alpha': '100'
      }
    ],
    medias: ['auto']
  },
  {
    kind: ['basic', 'effective'],
    label: 'stylize',
    shortDescription: 'monochrome(light)',
    parameters: [
      {
        auto: 'compress',
        monochrome: 'ff9b9b9b'
      }
    ],
    medias: ['auto']
  },
  {
    kind: ['basic', 'effective'],
    label: 'stylize',
    shortDescription: 'monochrome(dark)',
    parameters: [
      {
        auto: 'compress',
        monochrome: 'ff4a4a4a'
      }
    ],
    medias: ['auto']
  },
  {
    kind: ['basic', 'effective'],
    label: 'stylize',
    shortDescription: 'sepia tone',
    parameters: [
      {
        auto: 'compress',
        sepia: '80'
      }
    ],
    medias: ['auto']
  },
  {
    kind: ['basic', 'responsive'],
    label: 'responsive',
    shortDescription: '解像度別に4画像作成 (500x300)',
    parameters: [
      {
        auto: 'compress',
        dpr: '3',
        fit: 'crop',
        h: '300',
        w: '500'
      },
      {
        auto: 'compress',
        dpr: '2',
        fit: 'crop',
        h: '300',
        w: '500'
      },
      {
        auto: 'compress',
        dpr: '1.5',
        fit: 'crop',
        h: '300',
        w: '500'
      },
      {
        auto: 'compress',
        fit: 'crop',
        h: '300',
        w: '500'
      }
    ],
    medias: ['auto', 'auto', 'auto', 'auto']
  },
  {
    kind: ['basic', 'responsive'],
    label: 'responsive',
    shortDescription:
      'アートディレクション用に4画像作成(モバイルデバイス用含む)',
    parameters: [
      {
        auto: 'compress',
        w: '1024'
      },
      {
        auto: 'compress',
        w: '800'
      },
      {
        auto: 'compress',
        w: '500'
      },
      {
        auto: 'compress',
        crop: 'entropy',
        fit: 'crop',
        'max-h': '400',
        'max-w': '300'
      }
    ],
    medias: [1280, 960, 600, 320]
  },
  {
    kind: ['basic', 'card'],
    label: 'teitter card',
    shortDescription: 'Teitter Card用に画像サイズ等を調整',
    parameters: [
      {
        ar: '1.91:1',
        auto: 'compress',
        crop: 'entropy',
        fit: 'crop',
        w: '600'
      }
    ],
    medias: ['auto', 'auto']
  }
];

export function getImportTemplateItem(templateIdx: number): ImportTemplate {
  return BuiltinImportTemplate[templateIdx];
}
