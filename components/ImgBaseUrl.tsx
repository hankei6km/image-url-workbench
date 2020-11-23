import React, { useEffect, useState, useContext } from 'react';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import PreviewContext from '../components/PreviewContext';
import Validator from '../utils/validator';

const validator = Validator();

export type BaseUrlOnChangeEvent = { value: string };
export type BaseUrlOnEnterKeyEvent = { value: string };

type BaseUrlParamsProps = {
  label: string;
  baseUrl: string;
  onChange: (e: BaseUrlOnChangeEvent) => void;
  onEnterKey?: (e: BaseUrlOnEnterKeyEvent) => void;
};

export default function ImgBaseUrl({
  label,
  baseUrl,
  onChange,
  onEnterKey = (_e) => {}
}: BaseUrlParamsProps) {
  const { validateAssets, assets } = useContext(PreviewContext);
  const [value, setValue] = useState(baseUrl);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    setValue(baseUrl);
  }, [baseUrl]);

  return (
    <Box>
      <TextField
        error={errMsg ? true : false}
        id="image-base-url"
        label={label}
        // defaultValue={''}
        value={value}
        fullWidth
        helperText={errMsg}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            onEnterKey({ value: value });
            e.preventDefault();
          }
        }}
        onChange={(e) => {
          const newValue = e.target.value;
          setValue(newValue);
          const err = validator.assets(newValue, validateAssets, assets, true);
          if (err && newValue !== '') {
            setErrMsg(err.message);
          } else {
            onChange({ value: e.target.value });
            setErrMsg('');
          }
        }}
      />
    </Box>
  );
}
