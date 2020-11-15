import React, { useEffect, useState, useReducer } from 'react';
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
      if (newState.previewUrl && newState.previewUrl !== state.previewUrl) {
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
  position?: string;
  top?: number | string; // 必要なものだけ
  width?: number;
  height?: number;
};

export default function ImgPreview({
  previewUrl,
  position,
  top,
  width,
  height
}: ImgPreviewProps) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const newState = { ...init };
    newState.previewUrl = previewUrl;
    newState.state = 'loading';
    setTimeout(() => dispatch({ type: 'setUrl', payload: [previewUrl] }), 1); // dispatch でないと即時反映されない?
    return newState;
  });
  const [imgWidth, setImgWidth] = useState<string | number>(0);
  const [imgHeight, setImgHeight] = useState<string | number>(0);

  useEffect(() => {
    dispatch({ type: 'setUrl', payload: [previewUrl] });
    if (previewUrl) {
      const img = new Image();
      const handleLoad = (e: Event) => {
        if (e.target) {
          // console.log(`${img.width}x${img.height}`);
          if (width !== undefined) {
            setImgWidth(width);
            setImgHeight((img.height * width) / img.width);
          } else if (height !== undefined) {
            setImgWidth((img.width * height) / img.height);
            setImgHeight(height);
          }
          dispatch({ type: 'setWidth', payload: [`${width}`] });
          dispatch({ type: 'done', payload: [''] });
        }
      };
      img.addEventListener('load', handleLoad);
      img.src = previewUrl;
      return () => {
        img.removeEventListener('load', handleLoad);
      };
    } else {
      setImgWidth(width || 0);
      setImgHeight(height || 0);
      dispatch({ type: 'setWidth', payload: ['100%'] });
      dispatch({ type: 'done', payload: [''] });
    }
  }, [previewUrl, width, height]);

  return (
    <Box width={'100%'} position={position} top={top}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        width="100%"
      >
        <Box display="flex" justifyContent="center" width="100%">
          <img
            src={state.previewUrl}
            width={imgWidth}
            height={imgHeight}
            alt=""
            // width="100%"
            // onLoad={(e) => {
            //   if (e.currentTarget) {
            //     const rect = e.currentTarget.getBoundingClientRect();
            //     dispatch({ type: 'setWidth', payload: [`${rect.width}px`] });
            //     dispatch({ type: 'done', payload: [''] });
            //   }
            // }}
            onError={() => {
              dispatch({ type: 'err', payload: [''] });
            }}
          />
        </Box>
        <Box
          flexGrow={1}
          display="flex"
          justifyContent="center"
          style={{
            position: 'relative',
            bottom: 4,
            marginBottom: state.state === 'loading' ? -4 : 0,
            opacity: 0.5
          }}
        >
          {state.state === 'loading' && (
            <LinearProgress style={{ width: state.width }} />
          )}
        </Box>
      </Box>
    </Box>
  );
}
