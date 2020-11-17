import React from 'react';
import { ImgParamsValues, imgUrlParseParams } from '../utils/imgParamsUtils';

export type PreviewItem = {
  previewUrl: string;
  baseImageUrl: string;
  imageParams: ImgParamsValues;
};

type PreviewContextState = {
  validateAssets: boolean;
  assets: string[];
  previewItem: PreviewItem;
};

// type actTypeSetAssets = {
//   type: 'setAssets';
//   payload: [string];
// };

type actTypeSetPreviewImageUrl = {
  type: 'setPreviewImageUrl';
  payload: [string];
};

type actType = actTypeSetPreviewImageUrl;

export const previewContextInitialState: PreviewContextState = {
  validateAssets: false,
  assets: [],
  previewItem: {
    previewUrl: '',
    baseImageUrl: '',
    imageParams: []
  }
};
export function previewContextReducer(
  state: PreviewContextState,
  action: actType
): PreviewContextState {
  const newState: PreviewContextState = { ...state };
  switch (action.type) {
    // case 'setAssets':
    //   try {
    //     newState.assets = JSON.parse(action.payload[0]);
    //   } catch (err) {
    //     console.error(`error: assets parse error: ${err.name}`);
    //   }
    //   break;
    case 'setPreviewImageUrl':
      newState.previewItem.previewUrl = action.payload[0];
      const [u, p] = action.payload[0].split('?', 2);
      newState.previewItem.baseImageUrl = u;
      if (p) {
        newState.previewItem.imageParams = imgUrlParseParams(p);
      } else {
        newState.previewItem.imageParams = [];
      }
      break;
  }
  return newState;
}

export const PreviewDispatch = React.createContext<React.Dispatch<actType>>(
  (_a: actType) => {}
);

const PreviewContext = React.createContext(previewContextInitialState);
export default PreviewContext;
