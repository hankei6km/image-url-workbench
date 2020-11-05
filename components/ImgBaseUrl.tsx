import React, { useEffect, useState, useContext } from 'react';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import PreviewContext from '../components/PreviewContext';

export type BaseUrlOnChangeEvent = { value: string };

type BaseUrlParamsProps = {
  baseUrl: string;
  onChange: (e: BaseUrlOnChangeEvent) => void;
};

export default function ImgBaseUrl({ baseUrl, onChange }: BaseUrlParamsProps) {
  const previewStateContext = useContext(PreviewContext);
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
        label="Image Base URL"
        // defaultValue={''}
        value={value}
        fullWidth
        helperText={errMsg}
        onChange={(e) => {
          const newValue = e.target.value;
          setValue(newValue);
          try {
            const u = new URL(newValue);
            if (previewStateContext.validateAssets && previewStateContext.assets.indexOf(u.origin) < 0) {
              setErrMsg('Incorect assets');
            } else {
              onChange({ value: e.target.value });
              setErrMsg('');
            }
          } catch (err) {}
        }}
      />
    </Box>
  );
}
