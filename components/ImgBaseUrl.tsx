import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';

export type BaseUrlOnChangeEvent = { value: string };

type BaseUrlParamsProps = {
  baseUrl: string;
  onChange: (e: BaseUrlOnChangeEvent) => void;
};

export default function ImgBaseUrl({ baseUrl, onChange }: BaseUrlParamsProps) {
  const [value, setValue] = useState(baseUrl);
  useEffect(() => {
    setValue(baseUrl);
  }, [baseUrl]);

  return (
    <Box>
      <TextField
        id="image-base-url"
        label="Image Base URL"
        // defaultValue={''}
        value={value}
        fullWidth
        onChange={(e) => {
          setValue(e.target.value);
          onChange({ value: e.target.value });
        }}
      />
    </Box>
  );
}
