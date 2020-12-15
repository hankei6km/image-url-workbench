import React from 'react';
import {
  ImgParamsValues,
  imgUrlParamsParseString,
  imgUrlParamsMergeObject,
  imgUrlParamsToString,
  imgDispDensity
} from '../utils/imgParamsUtils';
import {
  ImportTemplateParametersSet,
  ImportTemplateParameters
} from '../src/template';

export type CardType = 'summary' | 'summary_large_image';

type Card = {
  cardType: CardType;
  title: string;
  description: string;
};

type TagFragment = {
  altText: string;
  linkText: string;
  newTab: boolean;
};

export const BreakPointValues = [240, 330, 360, 410, 530, 760, 1020] as const;
export const BreakPointAutoAndValues = [
  'auto',
  'fit',
  ...BreakPointValues
] as const;
export type BreakPoint = typeof BreakPointAutoAndValues[number];

export function breakPointValue(
  media: BreakPoint,
  imgWidth: number
): BreakPoint {
  if (media === 'auto' || media === 'fit') {
    const idx = BreakPointValues.findIndex(
      (v) => typeof v === 'number' && v >= imgWidth
    );
    if (idx >= 0) {
      if (media === 'auto') {
        if (idx === 0) {
          return BreakPointValues[0];
        } else {
          return BreakPointValues[idx - 1];
        }
      }
      return BreakPointValues[idx];
    }
    return BreakPointValues[BreakPointValues.length - 1];
  }
  return media;
}

export function imgWidthCss(p: PreviewItem): number {
  return p.imgWidth / p.imgDispDensity;
}
export function imgHeightCss(p: PreviewItem): number {
  return p.imgHeight / p.imgDispDensity;
}

export const getTargetItemIndex = (
  previewSet: PreviewItem[],
  targetKey: string
): number => previewSet.findIndex(({ itemKey }) => itemKey === targetKey);

export const isPreviewSetReady = (previewSet: PreviewItem[]): boolean =>
  previewSet.every(({ imgWidth, imgHeight }) => imgWidth > 0 && imgHeight > 0);

export const PreviewDispatch = React.createContext<React.Dispatch<actType>>(
  (_a: actType) => {}
);

export type PreviewItem = {
  itemKey: string;
  previewUrl: string;
  baseImageUrl: string;
  imageParams: ImgParamsValues;
  imgWidth: number;
  imgHeight: number;
  imgDispDensity: number;
  media: BreakPoint;
};

export type PreviewSetKind = '' | 'sample' | 'recv' | 'data';
export type PreviewSetState = '' | 'pre-init' | 'init' | 'edited';

type PreviewContextState = {
  validateAssets: boolean;
  assets: string[];
  templateIdx: number;
  imageBaseUrl: string;
  baseParameterSet: ImportTemplateParameters[];
  baseMedias: BreakPoint[];
  editTargetKey: string; // 編集対象の item を取得するときに selector がほしくなるよね(redux でなくても使える?)
  defaultTargetKey: string;
  card: Card;
  tagFragment: TagFragment;
  previewSetState: PreviewSetState;
  previewSetKind: PreviewSetKind;
  previewSet: PreviewItem[];
};

// type actTypeSetAssets = {
//   type: 'setAssets';
//   payload: [string];
// };

type actTypeResetPreviewSet = {
  type: 'resetPreviewSet';
  payload: [];
};

type actTypeTemplateIdx = {
  type: 'setTemplateIdx';
  payload: [number];
};

type actTypeSetImageBaseUrl = {
  type: 'setImageBaseUrl';
  payload: [PreviewSetKind, string];
};

type actTypeImportPreviewSet = {
  type: 'importPreviewSet';
  payload: [PreviewSetKind, string, ImportTemplateParametersSet, BreakPoint[]];
};

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

type actTypeSetPreviewImageMedia = {
  type: 'setPreviewImageMedia';
  payload: [string, BreakPoint];
};

type actTypeMergeParametersToImageUrl = {
  type: 'mergeParametersToImageUrl';
  payload: [string, ImportTemplateParametersSet, BreakPoint[]];
};

type actTypeMakeVariantImages = {
  type: 'makeVariantImages';
  payload: [string, ImportTemplateParametersSet, BreakPoint[]];
};

type actTypeClonePreviewImageUrl = {
  type: 'clonePreviewImageUrl';
  payload: [string];
};

type actTypeSetCard = {
  type: 'setCard';
  payload: [CardType, string, string];
};

type actTypeSetTagFragment = {
  type: 'setTagFragment';
  payload: [string, string, boolean];
};

type actTypeSetEditTarget = {
  type: 'setEditTarget';
  payload: [string];
};

type actTypeSetDefaultTarget = {
  type: 'setDefaultTarget';
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
  | actTypeResetPreviewSet
  | actTypeTemplateIdx
  | actTypeSetImageBaseUrl
  | actTypeImportPreviewSet
  | actTypeAddPreviewImageUrl
  | actTypeSetPreviewImageUrl
  | actTypeSetPreviewImageSize
  | actTypeSetPreviewImageMedia
  | actTypeMergeParametersToImageUrl
  | actTypeMakeVariantImages
  | actTypeClonePreviewImageUrl
  | actTypeSetCard
  | actTypeSetTagFragment
  | actTypeSetEditTarget
  | actTypeSetDefaultTarget
  | actTypeRemoveFromSet
  | actTypeSortSet;

export const previewContextInitialState: PreviewContextState = {
  validateAssets: false,
  assets: [],
  templateIdx: -1,
  imageBaseUrl: '',
  baseParameterSet: [],
  baseMedias: [],
  editTargetKey: '',
  defaultTargetKey: '',
  card: {
    cardType: 'summary_large_image',
    title: '',
    description: ''
  },
  tagFragment: {
    altText: '',
    linkText: '',
    newTab: false
  },
  previewSetState: '',
  previewSetKind: '',
  previewSet: []
};

function nextPreviewSetState(
  state: PreviewContextState,
  action: actType
): PreviewSetState {
  let ret = state.previewSetState;
  switch (action.type) {
    case 'resetPreviewSet':
      ret = '';
      break;
    case 'setTemplateIdx':
      ret = state.previewSetState;
      break;
    case 'setImageBaseUrl':
      ret = 'pre-init';
      break;
    case 'importPreviewSet':
      ret = 'init';
      break;
    case 'addPreviewImageUrl':
      ret = 'edited';
      break;
    case 'setPreviewImageUrl':
      ret = 'edited';
      break;
    case 'setPreviewImageSize':
      ret = state.previewSetState;
      break;
    case 'setPreviewImageMedia':
      ret = 'edited';
      break;
    case 'mergeParametersToImageUrl':
      ret = 'edited';
      break;
    case 'makeVariantImages':
      ret = 'edited';
      break;
    case 'clonePreviewImageUrl':
      ret = 'edited';
      break;
    case 'setCard':
      ret = state.previewSetState;
      break;
    case 'setTagFragment':
      ret = state.previewSetState;
      break;
    case 'setEditTarget':
      ret = 'edited';
      break;
    case 'setDefaultTarget':
      ret = 'edited';
      break;
    case 'removeFromSet':
      ret = 'edited';
      break;
    case 'sortSet':
      ret = state.previewSetState;
      break;
  }
  return ret;
}

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
    case 'resetPreviewSet':
      newState.editTargetKey = '';
      newState.defaultTargetKey = '';
      newState.previewSetKind = '';
      newState.previewSet = [];
      break;
    case 'setTemplateIdx':
      newState.templateIdx = action.payload[0];
      break;
    case 'setImageBaseUrl':
      newState.previewSetKind = action.payload[0];
      newState.imageBaseUrl = action.payload[1];
      break;
    case 'importPreviewSet':
      newState.previewSetKind = action.payload[0];
      newState.imageBaseUrl = action.payload[1];
      newState.baseParameterSet = action.payload[2];
      newState.baseMedias = action.payload[3];
      const medias = action.payload[3] || [];
      const mediasLen = medias.length;
      newState.previewSet = action.payload[2].map((v, i) => {
        const [u, p] = action.payload[1].split('?', 2);
        const q = imgUrlParamsMergeObject(
          p ? imgUrlParamsParseString(p) : [],
          v
        );
        const s = imgUrlParamsToString(q);
        const paramsString = s ? `?${s}` : '';
        const previewItem: PreviewItem = {
          itemKey: `${Date.now()}-${i}`,
          previewUrl: `${u}${paramsString}`,
          baseImageUrl: u,
          imageParams: q,
          imgWidth: 0,
          imgHeight: 0,
          imgDispDensity: imgDispDensity(q),
          media: i < mediasLen ? medias[i] : 'auto'
        };
        return previewItem;
      });
      const l = newState.previewSet.length;
      if (l > 0) {
        newState.editTargetKey = newState.previewSet[0].itemKey;
        newState.defaultTargetKey = newState.previewSet[l - 1].itemKey;
      }
      break;
    case 'addPreviewImageUrl':
      if (action.payload[0]) {
        const [u, p] = action.payload[0].split('?', 2);
        const q = p ? imgUrlParamsParseString(p) : [];
        const previewItem: PreviewItem = {
          itemKey: `${Date.now()}`,
          previewUrl: action.payload[0],
          baseImageUrl: u,
          imageParams: q,
          imgWidth: 0,
          imgHeight: 0,
          imgDispDensity: imgDispDensity(q),
          media: 'auto'
        };
        newState.editTargetKey = previewItem.itemKey;
        if (newState.defaultTargetKey === '') {
          newState.defaultTargetKey = previewItem.itemKey;
        }
        newState.previewSet.push(previewItem);
      }
      break;
    case 'setPreviewImageUrl':
      if (action.payload[0]) {
        const [u, p] = action.payload[0].split('?', 2);
        const q = p ? imgUrlParamsParseString(p) : [];
        const previewItem: PreviewItem = {
          itemKey: state.editTargetKey,
          previewUrl: action.payload[0],
          baseImageUrl: u,
          imageParams: q,
          imgWidth: 0,
          imgHeight: 0,
          imgDispDensity: imgDispDensity(q),
          media: 'auto'
        };
        const idx = state.previewSet.findIndex(
          (v) => v.itemKey === state.editTargetKey
        );
        if (idx >= 0) {
          if (previewItem.previewUrl === state.previewSet[idx].previewUrl) {
            previewItem.imgWidth = state.previewSet[idx].imgWidth;
            previewItem.imgHeight = state.previewSet[idx].imgHeight;
            previewItem.media = state.previewSet[idx].media;
          }
          newState.previewSet[idx] = previewItem;
        } else {
          newState.previewSet.push(previewItem);
        }
      }
      break;
    case 'setPreviewImageSize':
      if (action.payload[0]) {
        const idx = state.previewSet.findIndex(
          (v) => v.itemKey === action.payload[0]
        );
        if (idx >= 0) {
          newState.previewSet[idx].imgWidth = action.payload[1];
          newState.previewSet[idx].imgHeight = action.payload[2];
        }
      }
      break;
    case 'setPreviewImageMedia':
      if (action.payload[0]) {
        const idx = state.previewSet.findIndex(
          (v) => v.itemKey === action.payload[0]
        );
        if (idx >= 0) {
          newState.previewSet[idx].media = action.payload[1];
        }
      }
      break;
    case 'mergeParametersToImageUrl':
      if (
        action.payload[0] &&
        action.payload[1].length === 1 &&
        action.payload[2].length <= 1
      ) {
        const idx = getTargetItemIndex(state.previewSet, action.payload[0]);
        if (idx >= 0) {
          const item = state.previewSet[idx];
          const q = imgUrlParamsMergeObject(
            item.imageParams,
            action.payload[1][0]
          );
          const s = imgUrlParamsToString(q);
          const paramsString = s ? `?${s}` : '';

          newState.previewSet[
            idx
          ].previewUrl = `${item.baseImageUrl}${paramsString}`;
          newState.previewSet[idx].imageParams = q;
          newState.previewSet[idx].imgWidth = 0;
          newState.previewSet[idx].imgHeight = 0;
          newState.previewSet[idx].imgDispDensity = imgDispDensity(q);
          newState.previewSet[idx].media = action.payload[2][0];
          newState.editTargetKey = state.previewSet[idx].itemKey;
        }
      }
      break;
    case 'makeVariantImages':
      if (action.payload[0]) {
        const idx = getTargetItemIndex(state.previewSet, action.payload[0]);
        if (idx >= 0) {
          const item = state.previewSet[idx];
          const medias = action.payload[2] || [];
          const mediasLen = medias.length;
          newState.previewSet = action.payload[1].map((v, i) => {
            const q = imgUrlParamsMergeObject(item.imageParams, v);
            const s = imgUrlParamsToString(q);
            const paramsString = s ? `?${s}` : '';
            const previewItem: PreviewItem = {
              itemKey: `${Date.now()}-${i}`,
              previewUrl: `${item.baseImageUrl}${paramsString}`,
              baseImageUrl: item.baseImageUrl,
              imageParams: q,
              imgWidth: 0,
              imgHeight: 0,
              imgDispDensity: imgDispDensity(q),
              media: i < mediasLen ? medias[i] : 'auto'
            };
            return previewItem;
          });
          const l = newState.previewSet.length;
          if (l > 0) {
            newState.editTargetKey = newState.previewSet[0].itemKey;
            newState.defaultTargetKey = newState.previewSet[l - 1].itemKey;
          }
        }
      }
      break;
    case 'clonePreviewImageUrl':
      if (action.payload[0]) {
        const idx = state.previewSet.findIndex(
          (v) => v.itemKey === action.payload[0]
        );
        if (idx >= 0) {
          //array の clone 代わりに再作成
          const [u, p] = state.previewSet[idx].previewUrl.split('?', 2);
          const previewItem: PreviewItem = {
            itemKey: `${Date.now()}`,
            previewUrl: state.previewSet[idx].previewUrl,
            baseImageUrl: u,
            imageParams: p ? imgUrlParamsParseString(p) : [],
            imgWidth: state.previewSet[idx].imgWidth,
            imgHeight: state.previewSet[idx].imgHeight,
            imgDispDensity: state.previewSet[idx].imgDispDensity,
            media: state.previewSet[idx].media
          };
          newState.previewSet.splice(idx + 1, 0, previewItem);
          newState.editTargetKey = previewItem.itemKey;
        }
      }
      break;
    case 'setCard':
      newState.card.cardType = action.payload[0];
      newState.card.title = action.payload[1];
      newState.card.description = action.payload[2];
      break;
    case 'setTagFragment':
      newState.tagFragment.altText = action.payload[0];
      newState.tagFragment.linkText = action.payload[1];
      newState.tagFragment.newTab = action.payload[2];
      break;
    case 'setEditTarget':
      newState.editTargetKey = action.payload[0];
      break;
    case 'setDefaultTarget':
      newState.defaultTargetKey = action.payload[0];
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
      newState.previewSet.sort((a, b) => {
        const r = imgWidthCss(b) - imgWidthCss(a);
        return r === 0 ? b.imgDispDensity - a.imgDispDensity : r;
      });
      break;
  }
  newState.previewSetState = nextPreviewSetState(state, action);
  return newState;
}

const PreviewContext = React.createContext(previewContextInitialState);

export default PreviewContext;
