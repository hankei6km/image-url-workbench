export type ImportTemplateParameters = { [key: string]: string };
export type ImportTemplateParametersSet = ImportTemplateParameters[];
export type ImportTemplate = {
  label: string;
  imageBaseUrl: string;
  sampleParameters: ImportTemplateParametersSet;
  parameters: ImportTemplateParametersSet;
};

export type ImportTemplateList = ImportTemplate[];

export const BuiltinImportTemplate: ImportTemplateList = [
  {
    label: 'responsive',
    imageBaseUrl:
      'https://images.microcms-assets.io/protected/ap-northeast-1:9063452c-019d-4ffe-a96f-1a4524853eda/service/re-plotter/media/2020-10-24-jog1.jpg',
    sampleParameters: [
      {
        auto: 'compress',
        txt: 'sample image',
        'txt-color': 'efffffff',
        'txt-pad': '80',
        'txt-shad': '1',
        'txt-size': '70',
        w: '1024'
      },
      {
        auto: 'compress',
        txt: 'sample image',
        'txt-color': 'efffffff',
        'txt-pad': '62',
        'txt-shad': '1',
        'txt-size': '54',
        w: '800'
      },
      {
        auto: 'compress',
        txt: 'sample image',
        'txt-color': 'efffffff',
        'txt-pad': '46',
        'txt-shad': '1',
        'txt-size': '41',
        w: '600'
      },
      {
        auto: 'compress',
        crop: 'entropy',
        fit: 'crop',
        'max-h': '400',
        'max-w': '480',
        txt: 'sample image',
        'txt-color': 'efffffff',
        'txt-pad': '37',
        'txt-shad': '1',
        'txt-size': '32'
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
        w: '600'
      },
      {
        auto: 'compress',
        crop: 'entropy',
        fit: 'crop',
        'max-h': '400',
        'max-w': '480'
      }
    ]
  },
  {
    label: 'card(twitter)',
    imageBaseUrl:
      'https://images.microcms-assets.io/protected/ap-northeast-1:9063452c-019d-4ffe-a96f-1a4524853eda/service/re-plotter/media/2020-10-24-jog1.jpg',
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
    ]
  }
];
