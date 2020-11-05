import React from 'react';

type previewContextState = {
  validateAssets: boolean;
  assets: string[];
  previewImageUrl: string;
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

export const previewContextInitialState: previewContextState = {
  validateAssets: false,
  assets: [],
  previewImageUrl: ''
};
export function previewContextReducer(
  state: previewContextState,
  action: actType
): previewContextState {
  const newState: previewContextState = { ...state };
  switch (action.type) {
    // case 'setAssets':
    //   try {
    //     newState.assets = JSON.parse(action.payload[0]);
    //   } catch (err) {
    //     console.error(`error: assets parse error: ${err.name}`);
    //   }
    //   break;
    case 'setPreviewImageUrl':
      newState.previewImageUrl = action.payload[0];
      break;
  }
  return newState;
}

export const PreviewDispatch = React.createContext<React.Dispatch<actType>>(
  (_a: actType) => {}
);

const PreviewContext = React.createContext(previewContextInitialState);
export default PreviewContext;
