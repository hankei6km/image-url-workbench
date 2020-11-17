import React from 'react';
import { ImgParamsValues, imgUrlParseParams } from '../utils/imgParamsUtils';

type Card = {
  title: string;
  description: string;
};

type TagFragment = {
  altText: string;
  linkText: string;
  newTab: boolean;
};

type PreviewItem = {
  previewUrl: string;
  baseImageUrl: string;
  imageParams: ImgParamsValues;
  card: Card;
  tagFragment: TagFragment;
};

type PreviewContextState = {
  validateAssets: boolean;
  assets: string[];
  previewItem: PreviewItem;
  previewSet: PreviewItem[];
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

type actTypeSetTagFragment = {
  type: 'setTagFragment';
  payload: [string, string, boolean];
};

type actTypePushToSet = {
  type: 'pushToSet';
  payload: [];
};

type actTypePopFromSet = {
  type: 'popFromSet';
  payload: [string];
};

type actTypeRemoveFromSet = {
  type: 'removeFromSet';
  payload: [string];
};

type actType =
  | actTypeSetPreviewImageUrl
  | actTypeSetCard
  | actTypeSetTagFragment
  | actTypePushToSet
  | actTypePopFromSet
  | actTypeRemoveFromSet;

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
    tagFragment: {
      altText: '',
      linkText: '',
      newTab: false
    }
  },
  previewSet: []
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
    case 'setTagFragment':
      newState.previewItem.tagFragment.altText = action.payload[0];
      newState.previewItem.tagFragment.linkText = action.payload[1];
      newState.previewItem.tagFragment.newTab = action.payload[2];
      break;
    case 'pushToSet':
      if (state.previewItem.previewUrl) {
        const idx = state.previewSet.findIndex(
          (v) => v.previewUrl === state.previewItem.previewUrl
        );
        if (idx >= 0) {
          newState.previewSet[idx] = { ...state.previewItem };
        } else {
          newState.previewSet.push({ ...state.previewItem });
        }
      }
      break;
    case 'popFromSet':
      {
        const idx = state.previewSet.findIndex(
          (v) => v.previewUrl === action.payload[0]
        );
        if (idx >= 0) {
          newState.previewItem = { ...state.previewSet[idx] };
        }
      }
      break;
    case 'removeFromSet':
      {
        const idx = state.previewSet.findIndex(
          (v) => v.previewUrl === action.payload[0]
        );
        if (idx >= 0) {
          state.previewSet.splice(idx, 1);
        }
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
