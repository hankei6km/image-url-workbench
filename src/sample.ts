export type SampleImageParameters = { [key: string]: string };
export type SampleImageParametersSet = {
  query: string;
  fileNameSuffix: string;
  parameters: SampleImageParameters;
}[];

export const SampleImageBuildParametersSet: SampleImageParametersSet = [
  {
    query: '',
    fileNameSuffix: '',
    parameters: {
      auto: 'compress',
      crop: 'entropy',
      fit: 'crop',
      h: '80',
      w: '160'
    }
  }
];

export type SampleImage = {
  label: string;
  imageUrl: string;
  imagePaths: string[]; // 静的サイトとしてビルドした場合は表示用の画像をローカルに置く予定(たぶん)
  // クレジット表示用(項目は暫定 、icense にSPDX はいる?)
  author?: string[];
  license?: string;
  webPage?: string;
};

export type SampleImageList = SampleImage[];

export const BuiltinSampleImages: SampleImageList = [
  {
    label: 'river',
    imageUrl:
      'https://images.microcms-assets.io/protected/ap-northeast-1:9063452c-019d-4ffe-a96f-1a4524853eda/service/re-plotter/media/2020-10-24-jog1.jpg',
    imagePaths: []
  },
  {
    label: 'river',
    imageUrl:
      'https://images.microcms-assets.io/protected/ap-northeast-1:9063452c-019d-4ffe-a96f-1a4524853eda/service/re-plotter/media/2020-10-18-kaze.jpg',
    imagePaths: []
  },
  {
    label: 'river',
    imageUrl:
      'https://images.microcms-assets.io/protected/ap-northeast-1:9063452c-019d-4ffe-a96f-1a4524853eda/service/re-plotter/media/2020-11-03-yoko2.jpg',
    imagePaths: []
  }
];
