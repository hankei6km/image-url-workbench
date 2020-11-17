import React from 'react';
import { ImgParamsValues, imgUrlParseParams } from '../utils/imgParamsUtils';

type Card = {
  title: string;
  description: string;
};

type Fragment = {
  altText: string;
  linkText: string;
  newTab: boolean;
};

type PreviewItem = {
  previewUrl: string;
  baseImageUrl: string;
  imageParams: ImgParamsValues;
  card: Card;
  fragment: Fragment;
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

type actTypeSetCard = {
  type: 'setCard';
  payload: [string, string];
};

type actType = actTypeSetPreviewImageUrl | actTypeSetCard;

export const previewContextInitialState: PreviewContextState = {
  validateAssets: false,
  assets: [],
  previewItem: {
    previewUrl: '',
    baseImageUrl: '',
    imageParams: [],
    card: {
      title: '',
      description: ''
    },
    fragment: {
      altText: '',
      linkText: '',
      newTab: false
    }
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
    case 'setCard':
      newState.previewItem.card.title = action.payload[0];
      newState.previewItem.card.description = action.payload[1];
      break;
  }
  return newState;
}

export const PreviewDispatch = React.createContext<React.Dispatch<actType>>(
  (_a: actType) => {}
);

const PreviewContext = React.createContext(previewContextInitialState);
export default PreviewContext;
