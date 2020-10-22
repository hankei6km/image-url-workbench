import React from 'react';
// import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { paramsKeyToSpread } from '../utils/imgParamsUtils';

export type ImgUrlParamsOnChangeEvent = { value: string | number };
type ImgParamsProps = {
  paramsKey: string;
  onChange: (e: ImgUrlParamsOnChangeEvent) => void;
};

export default function ImgParams({ paramsKey, onChange }: ImgParamsProps) {
  return (
    <Box
      p={1}
      key={paramsKey}
      display="flex"
      flexDirection="row"
      alignItems="center"
    >
      <TextField
        variant="outlined"
        id={paramsKey}
        {...paramsKeyToSpread(paramsKey)}
        fullWidth
        onChange={(e) => onChange({ value: e.target.value })}
      />
    </Box>
  );
}
