import React, { useReducer, useCallback, useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { decodeBase64Url, encodeBase64Url } from '../utils/base64';
import ImgParams, {
  ImgUrlParamsOnChangeEvent,
  ImgParamsEnabled
} from '../components/ImgParams';
import {
  paramsKeyDisallowBase64,
  paramsKeyParameters,
  ImgParamsItems,
  imgParamsCategories,
  imgParamsInCategory
} from '../utils/imgParamsUtils';

type previewUrlStateParam = {
  enabled: boolean;
  key: string;
  value: string;
};

type previewUrlState = {
  previewUrl: string;
  baseUrl: string;
  params: previewUrlStateParam[];
};

const initialState: previewUrlState = {
  previewUrl: '',
  baseUrl: '',
  params: []
};
// function initState(s: paramsState): paramsState {
//   return { ...s };
// }
// オブジェクトで型を指定しておいた方が payload の型を拘束できるのだが、
// debouce する関数をまとめるのが難しいので今回は見送り
// type actSetParam = { type: 'setParam'; payload: [string, string] };
// type actSetImgUrl = { type: 'setImageRawUrl'; payload: string };
type actTypeInput = {
  type: 'setParam' | 'setImageRawUrl';
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
    case 'setImageRawUrl':
      const [u, p] = action.payload[0].split('?', 2);
      newState.baseUrl = u;
      if (p) {
        const q = new URLSearchParams(p);
        newState.params = [];
        q.forEach((v, k) => {
          if (k.slice(-2) === '64') {
            const bareKeyName = k.slice(0, -2);
            if (paramsKeyParameters(bareKeyName)) {
              newState.params.push({
                enabled: true,
                key: k.slice(0, -2),
                value: decodeBase64Url(v)
              });
            }
          } else {
            if (paramsKeyParameters(k)) {
              newState.params.push({
                enabled: true,
                key: k,
                value: v
              });
            }
          }
        });
      }
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
  const paramsString = newState.baseUrl && s ? `?${s}` : '';
  newState.previewUrl = `${newState.baseUrl}${paramsString}`;
  return newState;
}

export type ParamsItem = ImgParamsItems;
export type ImgUrOnChangeImageUrlEvent = { value: string };
export type ImgUrOnChangePreviewUrlEvent = { value: string };
type ImgUrlProps = {
  paramsItem: ParamsItem;
  imageRawUrl: string;
  onChangeImageUrl: (e: ImgUrOnChangePreviewUrlEvent) => void;
  onChangePreviewUrl: (e: ImgUrOnChangePreviewUrlEvent) => void;
};

export default function ImgUrl({
  paramsItem,
  imageRawUrl: baseUrl,
  onChangeImageUrl,
  onChangePreviewUrl
}: ImgUrlProps) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const newState = { ...init };
    newState.baseUrl = baseUrl;
    return newState;
  });

  useEffect(() => {
    // console.log(state.previewUrl);
    onChangeImageUrl({ value: state.baseUrl });
  }, [state.baseUrl, onChangeImageUrl]);

  useEffect(() => {
    // console.log(state.previewUrl);
    onChangePreviewUrl({ value: state.previewUrl });
  }, [state.previewUrl, onChangePreviewUrl]);

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

  const paramsValue = useCallback(
    (paramKey: string) => {
      const idx = state.params.findIndex(
        ({ enabled, key }) => key === paramKey && enabled
      );
      return idx >= 0 ? state.params[idx].value : '';
    },
    [state.params]
  );

  useEffect(() => {
    debounceInputText('setImageRawUrl', '')({ value: baseUrl });
  }, [baseUrl]);

  // state が１つだと map のループが回るよね?
  const [opened, setOpened] = useState('');
  const changeOpend = (category: string) => {
    return (_e: React.ChangeEvent<{}>, isExpanded: boolean): void => {
      setOpened(isExpanded ? category : '');
    };
  };

  return (
    <Box>
      {imgParamsCategories().map((v) => (
        <Accordion
          elevation={0}
          key={`category-${v}`}
          expanded={v===opened}
          onChange={changeOpend(v)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`category panel : ${v}`}
            id={`category-${v}`}
            IconButtonProps={{ edge: 'end' }}
          >
            {`${v}`}
          </AccordionSummary>
          <AccordionDetails style={{ padding: 0 }}>
            <Box width="100%">
              {opened === v &&
                imgParamsInCategory(paramsItem, v).map(
                  ({ paramsKey }: { paramsKey: string }) => (
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
                          paramsValue={paramsValue(paramsKey)}
                          onChange={debounceInputText('setParam', paramsKey)}
                        />
                      </Box>
                    </Box>
                  )
                )}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
