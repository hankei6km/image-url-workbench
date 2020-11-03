import React from 'react';

type previewContextState = {
  previewImageUrl: string;
};

type actType = {
  type: 'setPreviewImageUrl';
  payload: [string];
};

export const previewContextInitialState: previewContextState = {
  previewImageUrl: ''
};
export function previewContextReducer(
  state: previewContextState,
  action: actType
): previewContextState {
  const newState: previewContextState = { ...state };
  switch (action.type) {
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
