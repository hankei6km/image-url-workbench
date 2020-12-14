import { BreakPoint } from '../components/PreviewContext';

// 'basic': auto 等の外観には影響はないが、ファイルサイズ等に影響のあるような項目の指定。インポート時に使う
// 'size': 画像のサイズ変更を行う。workbench 上の各項目に上書きで適用
// 'effective': セピア調等の効果を複数の項目に適用する。workbench 上の各項目に上書きで適用
// 'responsive': １つの項目から画像のサイズ(ピクセル数)が異なる項目を作成する。複数の項目に適用はしない
// 'card': ソーシャルカード(Twitter Card)用にサイズの調整等を行う。'effective' でも良いか?
export type ImportTemplateKind =
  | 'basic'
  | 'size'
  | 'effective'
  | 'responsive'
  | 'card';
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
    shortDescription: '',
    parameters: [{}],
    medias: ['auto']
  },
  {
    kind: ['basic', 'effective'],
    label: 'compress',
    shortDescription: 'auto=compress 指定のみ',
    parameters: [
      {
        auto: 'compress'
      }
    ],
    medias: ['auto']
  },
  {
    kind: ['size'],
    label: 'size',
    shortDescription: '画像を 500x300 へサイズ変更',
    parameters: [
      {
        crop: 'entropy',
        fit: 'crop',
        h: '300',
        w: '500'
      }
    ],
    medias: ['auto']
  },
  {
    kind: ['size'],
    label: 'size',
    shortDescription: '画像を 500x300 へサイズ変更(left)',
    parameters: [
      {
        crop: 'left',
        fit: 'crop',
        h: '300',
        w: '500'
      }
    ],
    medias: ['auto']
  },
  {
    kind: ['size'],
    label: 'size',
    shortDescription: '画像を 500x300 へサイズ変更(right)',
    parameters: [
      {
        crop: 'right',
        fit: 'crop',
        h: '300',
        w: '500'
      }
    ],
    medias: ['auto']
  },
  {
    kind: ['size'],
    label: 'size',
    shortDescription: '画像を 500x300 へサイズ変更(entropy)',
    parameters: [
      {
        crop: 'entropy',
        fit: 'crop',
        h: '300',
        w: '500'
      }
    ],
    medias: ['auto']
  },
  {
    kind: ['effective'],
    label: 'stylize',
    shortDescription: 'blur',
    parameters: [
      {
        blur: '70'
      }
    ],
    medias: ['auto']
  },
  {
    kind: ['effective'],
    label: 'stylize',
    shortDescription: 'duotone',
    parameters: [
      {
        duotone: '000080,FA8072',
        'duotone-alpha': '100'
      }
    ],
    medias: ['auto']
  },
  {
    kind: ['effective'],
    label: 'stylize',
    shortDescription: 'monochrome(light)',
    parameters: [
      {
        monochrome: 'ff9b9b9b'
      }
    ],
    medias: ['auto']
  },
  {
    kind: ['effective'],
    label: 'stylize',
    shortDescription: 'monochrome(dark)',
    parameters: [
      {
        monochrome: 'ff4a4a4a'
      }
    ],
    medias: ['auto']
  },
  {
    kind: ['effective'],
    label: 'stylize',
    shortDescription: 'sepia tone',
    parameters: [
      {
        sepia: '80'
      }
    ],
    medias: ['auto']
  },
  {
    kind: ['responsive'],
    label: 'responsive',
    shortDescription: '解像度別に4画像作成 (500x300)',
    parameters: [
      {
        dpr: '3',
        h: '300',
        w: '500'
      },
      {
        dpr: '2',
        h: '300',
        w: '500'
      },
      {
        dpr: '1.5',
        h: '300',
        w: '500'
      },
      {
        dpr: '1',
        h: '300',
        w: '500'
      },
      {
        h: '300',
        w: '500'
      }
    ],
    medias: ['auto', 'auto', 'auto', 'auto']
  },
  {
    kind: ['responsive'],
    label: 'responsive',
    shortDescription: '解像度別に4画像作成 (500x300) デバッグラベル',
    parameters: [
      {
        dpr: '3',
        h: '300',
        txt: '3x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '40',
        'txt-size': '50',
        w: '500'
      },
      {
        dpr: '2',
        h: '300',
        txt: '2x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '40',
        'txt-size': '50',
        w: '500'
      },
      {
        dpr: '1.5',
        h: '300',
        txt: '1.5x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '40',
        'txt-size': '50',
        w: '500'
      },
      {
        dpr: '1',
        h: '300',
        txt: '1x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '40',
        'txt-size': '50',
        w: '500'
      },
      {
        h: '300',
        txt: 'default',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '40',
        'txt-size': '50',
        w: '500'
      }
    ],
    medias: ['auto', 'auto', 'auto', 'auto']
  },
  {
    kind: ['responsive'],
    label: 'responsive',
    shortDescription: '解像度別に4画像作成 (dpr 指定のみ)',
    parameters: [
      {
        dpr: '3'
      },
      {
        dpr: '2'
      },
      {
        dpr: '1.5'
      },
      {
        dpr: '1'
      },
      {
        txt: 'default'
      }
    ],
    medias: ['auto', 'auto', 'auto', 'auto']
  },
  {
    kind: ['responsive'],
    label: 'responsive',
    shortDescription: '解像度別に4画像作成 (dpr 指定のみ) デバッグラベル',
    parameters: [
      {
        dpr: '3',
        txt: '3x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '40',
        'txt-size': '50'
      },
      {
        dpr: '2',
        txt: '2x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '40',
        'txt-size': '50'
      },
      {
        dpr: '1.5',
        txt: '1.5x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '40',
        'txt-size': '50'
      },
      {
        dpr: '1',
        txt: '1x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '40',
        'txt-size': '50'
      },
      {
        txt: 'default',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '40',
        'txt-size': '50'
      }
    ],
    medias: ['auto', 'auto', 'auto', 'auto']
  },
  {
    kind: ['responsive'],
    label: 'responsive',
    shortDescription: 'アートディレクション用(モバイルデバイス用に複数dpr)',
    parameters: [
      {
        w: '1024'
      },
      {
        w: '800'
      },
      {
        dpr: '3',
        w: '500'
      },
      {
        dpr: '2',
        w: '500'
      },
      {
        dpr: '1',
        w: '500'
      },
      {
        dpr: '3',
        fit: 'crop',
        h: '400',
        w: '300'
      },
      {
        dpr: '2',
        fit: 'crop',
        h: '400',
        w: '300'
      },
      {
        dpr: '1',
        fit: 'crop',
        h: '400',
        w: '300'
      },
      {
        fit: 'crop',
        h: '400',
        w: '300'
      }
    ],
    medias: [
      'auto',
      'auto',
      'auto',
      'auto',
      'auto',
      'auto',
      'auto',
      'auto',
      'auto'
    ]
  },
  {
    kind: ['responsive'],
    label: 'responsive',
    shortDescription:
      'アートディレクション用(モバイルデバイス用に複数dpr) デバッグラベル',
    parameters: [
      {
        txt: '1024',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '80',
        'txt-size': '120',
        w: '1024'
      },
      {
        txt: '800',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '70',
        'txt-size': '100',
        w: '800'
      },
      {
        dpr: '3',
        txt: '500 3x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '50',
        'txt-size': '50',
        w: '500'
      },
      {
        dpr: '2',
        txt: '500 2x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '50',
        'txt-size': '50',
        w: '500'
      },
      {
        dpr: '1',
        txt: '500 1x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '50',
        'txt-size': '50',
        w: '500'
      },
      {
        dpr: '3',
        fit: 'crop',
        h: '400',
        txt: '300 3x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff9b9b9b',
        'txt-pad': '40',
        'txt-size': '50',
        w: '300'
      },
      {
        dpr: '2',
        fit: 'crop',
        h: '400',
        txt: '300 2x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff9b9b9b',
        'txt-pad': '40',
        'txt-size': '50',
        w: '300'
      },
      {
        dpr: '1',
        fit: 'crop',
        h: '400',
        txt: '300 1x',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff9b9b9b',
        'txt-pad': '40',
        'txt-size': '50',
        w: '300'
      },
      {
        fit: 'crop',
        h: '400',
        txt: 'default',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff9b9b9b',
        'txt-pad': '40',
        'txt-size': '60',
        w: '300'
      }
    ],
    medias: [
      'auto',
      'auto',
      'auto',
      'auto',
      'auto',
      'auto',
      'auto',
      'auto',
      'auto'
    ]
  },
  {
    kind: ['responsive'],
    label: 'responsive',
    shortDescription:
      'アートディレクション用(デフォルトは800、ビューポート600以上では580)',
    parameters: [
      {
        w: '580'
      },
      {
        w: '800'
      }
    ],
    medias: ['auto', 'auto']
  },
  {
    kind: ['responsive'],
    label: 'responsive',
    shortDescription:
      'アートディレクション用(デフォルトは800、ビューポート600以上では580) デバッグラベル',
    parameters: [
      {
        txt: '580',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '40',
        'txt-size': '50',
        w: '580'
      },
      {
        txt: 'default(800)',
        'txt-color': 'ffffffff',
        'txt-font': 'sans-serif,bold',
        'txt-line': '1',
        'txt-line-color': 'ff4a4a4a',
        'txt-pad': '40',
        'txt-size': '50',
        w: '800'
      }
    ],
    medias: ['auto', 'auto']
  },
  {
    kind: ['card'],
    label: 'teitter card',
    shortDescription: 'Teitter Card用に画像サイズ等を調整',
    parameters: [
      {
        h: '719',
        fit: 'crop',
        w: '1280'
      }
    ],
    medias: ['auto']
  },
  {
    kind: ['card'],
    label: 'teitter card',
    shortDescription: 'Teitter Card用に画像サイズ等を調整(entropy)',
    parameters: [
      {
        h: '719',
        crop: 'entropy',
        fit: 'crop',
        w: '1280'
      }
    ],
    medias: ['auto']
  },
  {
    kind: ['card'],
    label: 'teitter card',
    shortDescription: 'Teitter Card用に画像サイズ等を調整(face)',
    parameters: [
      {
        h: '719',
        crop: 'faces',
        fit: 'crop',
        w: '1280'
      }
    ],
    medias: ['auto']
  }
];

export function getImportTemplateItem(templateIdx: number): ImportTemplate {
  return BuiltinImportTemplate[templateIdx];
}
