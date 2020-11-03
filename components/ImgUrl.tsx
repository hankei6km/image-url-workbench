import { useReducer, useCallback, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import { encodeBase64Url } from '../utils/base64';
import ImgParams, {
  ImgUrlParamsOnChangeEvent,
  ImgParamsEnabled
} from '../components/ImgParams';
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

type paramTransformerFunc = (v: string | number) => string;
const transformer64Name: paramTransformerFunc = (v: string | number) =>
  `${v}64`;
const transformer64Value: paramTransformerFunc = (v: string | number) =>
  encodeBase64Url(v as string);

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
  onChange: (e: ImgUrOnChangeEvent) => void;
};

export default function ImgUrl({ paramsItem, baseUrl, onChange }: ImgUrlProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // console.log(state.previewUrl);
    onChange({ value: state.previewUrl });
  }, [state.previewUrl, onChange]);

  const debounceInputText = (
    // debounce だけでも無くなってきたような
    act: actTypeInput['type'] | actTypeEnabled['type'],
    paramKey = ''
  ) => {
    let id: any = 0;
    return (e: ImgUrlParamsOnChangeEvent) => {
      if (id !== 0) {
        clearTimeout(id);
      }
      const value = e.value;
      id = setTimeout(
        (payload: [string, string] & [string, boolean]) => {
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
            <ImgParamsEnabled
              paramsKey={paramsKey}
              enabled={paramKeyIsEnabled(paramsKey)}
              onChange={debounceInputText('setEnabled', paramsKey)}
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
