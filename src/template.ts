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
  sampleParameters: ImportTemplateParametersSet;
  parameters: ImportTemplateParametersSet;
  medias: BreakPoint[];
};

export type ImportTemplateList = ImportTemplate[];

export const BuiltinImportTemplate: ImportTemplateList = [
  {
    kind: ['basic'],
    label: 'plain',
    shortDescription: 'auto=compress 指定のみ',
    sampleParameters: [
      {
        auto: 'compress'
      }
    ],
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
    sampleParameters: [
      {
        auto: 'compress',
        blur: '70'
      }
    ],
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
    label: 'stylize',
    shortDescription: 'duotone',
    sampleParameters: [
      {
        auto: 'compress',
        duotone: '000080,FA8072',
        'duotone-alpha': '100'
      }
    ],
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
    sampleParameters: [
      {
        auto: 'compress',
        monochrome: 'ff9b9b9b'
      }
    ],
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
    sampleParameters: [
      {
        auto: 'compress',
        monochrome: 'ff4a4a4a'
      }
    ],
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
    sampleParameters: [
      {
        auto: 'compress',
        sepia: '80'
      }
    ],
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
    sampleParameters: [
      {
        auto: 'compress',
        dpr: '3',
        fit: 'crop',
        h: '300',
        txt: 'sample image 500 3x',
        'txt-color': 'efffffff',
        'txt-pad': '38',
        'txt-shad': '1',
        'txt-size': '33',
        w: '500'
      },
      {
        auto: 'compress',
        dpr: '2',
        fit: 'crop',
        h: '300',
        txt: 'sample image 500 2x',
        'txt-color': 'efffffff',
        'txt-pad': '38',
        'txt-shad': '1',
        'txt-size': '33',
        w: '500'
      },
      {
        auto: 'compress',
        dpr: '1.5',
        fit: 'crop',
        h: '300',
        txt: 'sample image 500 1.5x',
        'txt-color': 'efffffff',
        'txt-pad': '38',
        'txt-shad': '1',
        'txt-size': '33',
        w: '500'
      },
      {
        auto: 'compress',
        fit: 'crop',
        h: '300',
        txt: 'sample image 500',
        'txt-color': 'efffffff',
        'txt-pad': '38',
        'txt-shad': '1',
        'txt-size': '33',
        w: '500'
      }
    ],
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
    sampleParameters: [
      {
        auto: 'compress',
        txt: 'sample image 1024',
        'txt-color': 'efffffff',
        'txt-pad': '80',
        'txt-shad': '1',
        'txt-size': '70',
        w: '1024'
      },
      {
        auto: 'compress',
        txt: 'sample image 800',
        'txt-color': 'efffffff',
        'txt-pad': '62',
        'txt-shad': '1',
        'txt-size': '54',
        w: '800'
      },
      {
        auto: 'compress',
        txt: 'sample image 500',
        'txt-color': 'efffffff',
        'txt-pad': '38',
        'txt-shad': '1',
        'txt-size': '33',
        w: '500'
      },
      {
        auto: 'compress',
        crop: 'entropy',
        fit: 'crop',
        'max-h': '400',
        'max-w': '300',
        txt: 'sample image 300',
        'txt-color': 'efffffff',
        'txt-pad': '24',
        'txt-shad': '1',
        'txt-size': '21'
      }
    ],
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
    sampleParameters: [
      {
        ar: '1.91:1',
        auto: 'compress',
        crop: 'entropy',
        fit: 'crop',
        txt: 'sample card',
        'txt-align': 'center',
        'txt-color': 'efffffff',
        'txt-font': 'American Typewriter Condensed,Bold',
        'txt-pad': '40',
        'txt-shad': '1',
        'txt-size': '50',
        w: '600'
      }
    ],
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
