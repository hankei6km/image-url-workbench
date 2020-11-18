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

export type PreviewItem = {
  itemKey: string;
  previewUrl: string;
  baseImageUrl: string;
  imageParams: ImgParamsValues;
  imgWidth: number;
  imgHeight: number;
};

type PreviewContextState = {
  validateAssets: boolean;
  assets: string[];
  editTargetKey: string; // 編集対象の item を取得するときに selector がほしくなるよね(redux でなくても使える?)
  card: Card;
  tagFragment: TagFragment;
  previewSet: PreviewItem[];
};

// type actTypeSetAssets = {
//   type: 'setAssets';
//   payload: [string];
// };

type actTypeAddPreviewImageUrl = {
  type: 'addPreviewImageUrl';
  payload: [string];
};

type actTypeSetPreviewImageUrl = {
  type: 'setPreviewImageUrl';
  payload: [string];
};

type actTypeSetPreviewImageSize = {
  type: 'setPreviewImageSize';
  payload: [string, number, number];
};

type actTypeSetCard = {
  type: 'setCard';
  payload: [string, string];
};

type actTypeSetTagFragment = {
  type: 'setTagFragment';
  payload: [string, string, boolean];
};

type actTypeSetEditTarget = {
  type: 'setEditTarget';
  payload: [string];
};

type actTypeRemoveFromSet = {
  type: 'removeFromSet';
  payload: [string];
};

type actTypeSortSet = {
  type: 'sortSet';
  payload: []; //order key 等はここで指定(必要になったら)
};

type actType =
  | actTypeAddPreviewImageUrl
  | actTypeSetPreviewImageUrl
  | actTypeSetPreviewImageSize
  | actTypeSetCard
  | actTypeSetTagFragment
  | actTypeSetEditTarget
  | actTypeRemoveFromSet
  | actTypeSortSet;

export const previewContextInitialState: PreviewContextState = {
  validateAssets: false,
  assets: [],
  editTargetKey: '',
  card: {
    title: '',
    description: ''
  },
  tagFragment: {
    altText: '',
    linkText: '',
    newTab: false
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
    case 'addPreviewImageUrl':
      if (action.payload[0]) {
        const [u, p] = action.payload[0].split('?', 2);
        const previewItem = {
          itemKey: `${Date.now()}`,
          previewUrl: action.payload[0],
          baseImageUrl: u,
          imageParams: p ? imgUrlParseParams(p) : [],
          imgWidth: 0,
          imgHeight: 0
        };
        newState.editTargetKey = previewItem.itemKey;
        newState.previewSet.push(previewItem);
      }
      break;
    case 'setPreviewImageUrl':
      if (action.payload[0]) {
        const [u, p] = action.payload[0].split('?', 2);
        const previewItem = {
          itemKey: state.editTargetKey,
          previewUrl: action.payload[0],
          baseImageUrl: u,
          imageParams: p ? imgUrlParseParams(p) : [],
          imgWidth: 0,
          imgHeight: 0
        };
        const idx = state.previewSet.findIndex(
          (v) => v.itemKey === state.editTargetKey
        );
        if (idx >= 0) {
          newState.previewSet[idx] = previewItem;
        } else {
          newState.previewSet.push(previewItem);
        }
      }
      break;
    case 'setPreviewImageSize':
      if (action.payload[0]) {
        const idx = state.previewSet.findIndex(
          (v) => v.itemKey === state.editTargetKey
        );
        if (idx >= 0) {
          newState.previewSet[idx].imgWidth = action.payload[1];
          newState.previewSet[idx].imgHeight = action.payload[2];
        }
      }
      break;
    case 'setCard':
      newState.card.title = action.payload[0];
      newState.card.description = action.payload[1];
      break;
    case 'setTagFragment':
      newState.tagFragment.altText = action.payload[0];
      newState.tagFragment.linkText = action.payload[1];
      newState.tagFragment.newTab = action.payload[2];
      break;
    case 'setEditTarget':
      newState.editTargetKey = action.payload[0];
      break;
    case 'removeFromSet':
      {
        const idx = state.previewSet.findIndex(
          (v) => v.itemKey === action.payload[0]
        );
        if (idx >= 0) {
          state.previewSet.splice(idx, 1);
        }
      }
      break;
    case 'sortSet':
      newState.previewSet.sort(({ imgWidth: a }, { imgWidth: b }) => b - a);
      break;
  }
  return newState;
}

export const getEditTargetItemIndex = (
  previewSet: PreviewItem[],
  editTargetKey: string
): number => previewSet.findIndex(({ itemKey }) => itemKey === editTargetKey);

export const PreviewDispatch = React.createContext<React.Dispatch<actType>>(
  (_a: actType) => {}
);

const PreviewContext = React.createContext(previewContextInitialState);
export default PreviewContext;
