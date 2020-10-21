import React, { useState, useReducer, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
// import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';

type previewUrlState = {
  previewUrl: string;
  imgUrl: string;
  params: {
    enabled: boolean;
    key: string;
    value: string;
  }[];
};

const initialState: previewUrlState = {
  previewUrl: '',
  imgUrl: '',
  params: []
};
// function initState(s: paramsState): paramsState {
//   return { ...s };
// }
// オブジェクトで型を指定しておいた方が payload の型を拘束できるのだが、
// debouce する関数をまとめるのが難しいので今回は見送り
// type actSetParam = { type: 'setParam'; payload: [string, string] };
// type actSetImgUrl = { type: 'setImgUrl'; payload: string };
type actTypeInput = {
  type: 'setParam' | 'setImgUrl';
  payload: [string, string];
};
type actTypeEnabled = {
  type: 'setEnabled';
  payload: [string, boolean];
};
type actType = actTypeInput | actTypeEnabled;

function reducer(state: previewUrlState, action: actType): previewUrlState {
  const newState: previewUrlState = { ...state };
  switch (action.type) {
    case 'setEnabled':
    case 'setParam':
      const ak = action.payload[0];
      let replaced = false;
      const r = state.params.map(({ enabled, key, value }) => {
        if (key === ak) {
          replaced = true;
          return {
            enabled: action.type === 'setEnabled' ? action.payload[1] : enabled,
            key,
            value: action.type === 'setParam' ? action.payload[1] : value
          };
        }
        return { enabled, key, value };
      });
      if (!replaced) {
        r.push({
          enabled: action.type === 'setEnabled' ? action.payload[1] : false,
          key: action.payload[0],
          value: action.type === 'setParam' ? action.payload[1] : ''
        });
      }
      newState.params = r;
      break;
    case 'setImgUrl':
      newState.imgUrl = action.payload[0];
      break;
    default:
      throw new Error();
  }

  const q = new URLSearchParams('');
  newState.params
    .filter(({ enabled }) => enabled)
    .forEach(({ key, value }) => q.append(key, value));
  const s = q.toString();
  const paramsString = newState.imgUrl && s ? `?${s}` : '';
  newState.previewUrl = `${newState.imgUrl}${paramsString}`;
  return newState;
}

const regExpPlus = /\+/g;
const regExpSlash = /\//g;

const IndexPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [previewUrl, setPreviewUrl] = useState('');

  const debounceInputText = (
    act: actTypeInput['type'],
    paramKey = '',
    transformer = (v: string | number): string => `${v}`
  ) => {
    let id: any = 0;
    return ({
      target
    }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (id !== 0) {
        clearTimeout(id);
      }
      const value = transformer(target.value);
      id = setTimeout(
        (payload: [string, string]) => {
          dispatch({ type: act, payload: payload });
          id = 0;
        },
        1000,
        paramKey ? [paramKey, value] : [value, ''] // '' が無駄だよねぇ
      );
    };
  };

  useEffect(() => {
    console.log(state.previewUrl);
    setPreviewUrl(state.previewUrl);
  }, [state.previewUrl]);

  const paramKeyIsEnabled = useCallback(
    (paramKey: string) => {
      const idx = state.params.findIndex(
        ({ enabled, key }) => key === paramKey && enabled
      );
      return idx >= 0;
    },
    [state.params]
  );

  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <Container maxWidth="sm">
        <Box p={1}>
          <Card style={{ height: 200 }}>
            <img height="200" src={previewUrl} alt="preview" />
          </Card>
          <TextField
            id="preview-url"
            label="Preview URL"
            fullWidth
            value={previewUrl}
          />
        </Box>
        <Box p={1}>
          <TextField
            id="image-url"
            label="Image URL"
            defaultValue={''}
            fullWidth
            onChange={debounceInputText('setImgUrl')}
          />
        </Box>
        {[
          {
            paramsKey: 'txt64',
            label: 'text',
            defaultValue: '',
            transfomer: (v: string | number) => {
              // https://docs.imgix.com/apis/rendering#base64-variants
              // https://developer.mozilla.org/ja/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
              // https://stackoverflow.com/questions/24523532/how-do-i-convert-an-image-to-a-base64-encoded-data-url-in-sails-js-or-generally
              // https://qiita.com/awakia/items/049791daca69120d7035
              return Buffer.from(v as string, 'utf-8')
                .toString('base64')
                .replace(regExpSlash, '_')
                .replace(regExpPlus, '-');
            }
          },
          {
            paramsKey: 'txt-size',
            label: 'text font size',
            defaultValue: '12'
          },
          {
            paramsKey: 'txt-color',
            label: 'text color(#AARRGGBB)',
            defaultValue: 'FF000000'
          },
          {
            paramsKey: 'txt-align',
            label: 'text align',
            defaultValue: 'bottom,right'
          }
        ].map(
          ({
            paramsKey,
            label,
            defaultValue,
            transfomer
          }: {
            paramsKey: string;
            label: string;
            defaultValue: string;
            transfomer?: (v: string | number) => string;
          }) => (
            <Box
              p={1}
              key={paramsKey}
              display="flex"
              flexDirection="row"
              alignItems="center"
            >
              <Switch
                checked={paramKeyIsEnabled(paramsKey)}
                onChange={(e) => {
                  dispatch({
                    type: 'setEnabled',
                    payload: [paramsKey, e.target.checked]
                  });
                }}
                color="primary"
                name={label}
                inputProps={{ 'aria-label': `switch enabled ${label}` }}
              />
              <TextField
                variant="outlined"
                id={paramsKey}
                label={label}
                defaultValue={defaultValue}
                fullWidth
                onChange={debounceInputText('setParam', paramsKey, transfomer)}
              />
            </Box>
          )
        )}
      </Container>
    </Layout>
  );
};

export default IndexPage;
