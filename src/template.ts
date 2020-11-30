import { BreakPoint } from '../components/PreviewContext';

export type ImportTemplateParameters = { [key: string]: string };
export type ImportTemplateParametersSet = ImportTemplateParameters[];
export type ImportTemplate = {
  label: string;
  sampleParameters: ImportTemplateParametersSet;
  parameters: ImportTemplateParametersSet;
  medias: BreakPoint[];
};

export type ImportTemplateList = ImportTemplate[];

export const BuiltinImportTemplate: ImportTemplateList = [
  {
    label: 'responsive',
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
    label: 'card(twitter)',
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
      },
      {
        ar: '1:1.91',
        auto: 'compress',
        crop: 'entropy',
        fit: 'crop',
        txt: 'sample card',
        'txt-align': 'center,middle',
        'txt-color': 'efffffff',
        'txt-font': 'American Typewriter Condensed,Bold',
        'txt-shad': '1',
        'txt-size': '40',
        w: '314'
      }
    ],
    parameters: [
      {
        ar: '1.91:1',
        auto: 'compress',
        crop: 'entropy',
        fit: 'crop',
        w: '600'
      },
      {
        ar: '1:1.91',
        auto: 'compress',
        crop: 'entropy',
        fit: 'crop',
        w: '314'
      }
    ],
    medias: ['auto', 'auto']
  }
];
