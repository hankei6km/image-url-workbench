import { useReducer, useCallback, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import Switch from '@material-ui/core/Switch';
import ImgParams, { ImgUrlParamsOnChangeEvent } from '../components/ImgParams';
import { paramsKeyDisallowBase64 } from '../utils/imgParamsUtils';

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

const regExpPlus = /\+/g;
const regExpSlash = /\//g;
const regExpTrailEq = /=+$/g;
type paramTransformerFunc = (v: string | number) => string;
const transformer64Name: paramTransformerFunc = (v: string | number) =>
  `${v}64`;
const transformer64Value: paramTransformerFunc = (v: string | number) => {
  // https://docs.imgix.com/apis/rendering#base64-variants
  // https://developer.mozilla.org/ja/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
  // https://stackoverflow.com/questions/24523532/how-do-i-convert-an-image-to-a-base64-encoded-data-url-in-sails-js-or-generally
  // https://qiita.com/awakia/items/049791daca69120d7035
  return Buffer.from(`${v}`, 'utf-8')
    .toString('base64')
    .replace(regExpSlash, '_')
    .replace(regExpPlus, '-')
    .replace(regExpTrailEq, '');
};

const transformerPassthru: paramTransformerFunc = (
  v: string | number
): string => `${v}`;

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
          key: ak,
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
    .forEach(({ key, value }) => {
      const disallowBase64 = paramsKeyDisallowBase64(key);
      const transformerName: paramTransformerFunc = disallowBase64
        ? transformerPassthru
        : transformer64Name; // https://github.com/imgix/imgix-url-params disallow_base64
      const transformerValue: paramTransformerFunc = disallowBase64
        ? transformerPassthru
        : transformer64Value;
      q.append(transformerName(key), transformerValue(value));
    });
  const s = q.toString();
  const paramsString = newState.imgUrl && s ? `?${s}` : '';
  newState.previewUrl = `${newState.imgUrl}${paramsString}`;
  return newState;
}

export type ParamsItem = { paramsKey: string }[];
export type ImgUrOnChangeEvent = { value: string };
type ImgUrlProps = {
  paramsItem: ParamsItem;
  baseUrl: string;
  onChange: (e: ImgUrlParamsOnChangeEvent) => void;
};

export default function ImgUrl({ paramsItem, baseUrl, onChange }: ImgUrlProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // console.log(state.previewUrl);
    onChange({ value: state.previewUrl });
  }, [state.previewUrl, onChange]);

  const debounceInputText = (
    // debounce だけでも無くなってきたような
    act: actTypeInput['type'],
    paramKey = ''
  ) => {
    let id: any = 0;
    return (e: ImgUrlParamsOnChangeEvent) => {
      if (id !== 0) {
        clearTimeout(id);
      }
      const value = e.value;
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

  const paramKeyIsEnabled = useCallback(
    (paramKey: string) => {
      const idx = state.params.findIndex(
        ({ enabled, key }) => key === paramKey && enabled
      );
      return idx >= 0;
    },
    [state.params]
  );

  useEffect(() => {
    debounceInputText('setImgUrl', '')({ value: baseUrl });
  }, [baseUrl]);

  return (
    <Box>
      {paramsItem.map(({ paramsKey }: { paramsKey: string }) => (
        <Box
          p={1}
          key={paramsKey}
          display="flex"
          flexDirection="row"
          alignItems="center"
        >
          <Box>
            <Switch
              checked={paramKeyIsEnabled(paramsKey)}
              onChange={(e) => {
                dispatch({
                  type: 'setEnabled',
                  payload: [paramsKey, e.target.checked]
                });
              }}
              color="primary"
              name={paramsKey}
              inputProps={{ 'aria-label': `switch enabled ${paramsKey}` }}
            />
          </Box>
          <Box flexGrow={1}>
            <ImgParams
              paramsKey={paramsKey}
              onChange={debounceInputText('setParam', paramsKey)}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
}
