import React, { useCallback, useEffect, useReducer } from 'react';
// import { makeStyles, useTheme } from '@material-ui/core/styles';
// import Skeleton from '@material-ui/lab/Skeleton';
import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';

type previewImgState = {
  state: 'loading' | 'done' | 'err';
  previewUrl: string;
  width: string;
};

const initialState: previewImgState = {
  state: 'done',
  previewUrl: '',
  width: '100%'
};

type actType = {
  type: 'setUrl' | 'setWidth' | 'loading' | 'done' | 'err';
  payload: [string];
};
function reducer(state: previewImgState, action: actType): previewImgState {
  const newState: previewImgState = { ...state };
  switch (action.type) {
    case 'setUrl':
      newState.previewUrl = action.payload[0];
      if (newState.previewUrl) {
        newState.state = 'loading';
      }
      break;
    case 'setWidth':
      if (newState.previewUrl) {
        newState.width = action.payload[0];
      }
      break;
    case 'loading':
      if (newState.previewUrl) {
        newState.state = 'loading';
      }
      break;
    case 'done':
      newState.state = 'done';
      break;
    case 'err':
      newState.state = 'err';
      break;
  }
  return newState;
}

type ImgPreviewProps = {
  previewUrl: string;
  width?: number | string;
  height?: number | string;
};

export default function ImgPreview({
  previewUrl,
  width,
  height
}: ImgPreviewProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  // const [imgUrl, setImgUrl] = useState('');

  useEffect(() => dispatch({ type: 'setUrl', payload: [previewUrl] }), [
    previewUrl
  ]);

  const imgRef = useCallback((node) => {
    if (node != null) {
      if (node.complete) {
        const rect = node.getBoundingClientRect();
        dispatch({ type: 'setWidth', payload: [`${rect.width}px`] });
        dispatch({ type: 'done', payload: [''] });
        // } else {
        //   dispatch({ type: 'loading', payload: [''] });
      }
      //} else {
      //  dispatch({ type: 'loading', payload: [''] });
    }
  }, []);

  return (
    <Box width="100%">
      <Box display="flex" justifyContent="center" width="100%">
        <img
          ref={imgRef}
          style={{
            // height: height,
            maxWidth: width,
            maxHeight: height
          }}
          src={state.previewUrl}
          width={width}
          height={height}
          alt=""
          // width="100%"
          onLoad={(e) => {
            if (e.currentTarget) {
              const rect = e.currentTarget.getBoundingClientRect();
              dispatch({ type: 'setWidth', payload: [`${rect.width}px`] });
              dispatch({ type: 'done', payload: [''] });
            }
          }}
          onError={() => {
            dispatch({ type: 'err', payload: [''] });
          }}
        />
      </Box>
      <Box
        display="flex"
        alignContent="flex-start"
        style={{
          height: 10
        }}
      >
        <Box flexGrow={1} display="flex" justifyContent="center">
          {state.state === 'loading' && (
            <LinearProgress style={{ width: state.width }} />
          )}
        </Box>
      </Box>
    </Box>
  );
}
