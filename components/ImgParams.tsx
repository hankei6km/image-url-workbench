import React, { useState } from 'react';
// import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import {
  paramsKeyToSpread,
  paramsKeyToRange,
  paramsKeyIsColor
} from '../utils/imgParamsUtils';

export type ImgUrlParamsOnChangeEvent = { value: string | number };

type ImgParamsProps = {
  paramsKey: string;
  onChange: (e: ImgUrlParamsOnChangeEvent) => void;
};

type ImgParamsRangeProps = {
  suggestRange: [number, number | undefined];
  // paramsKey: string;
  // onChange: (e: ImgUrlParamsOnChangeEvent) => void;
  //};
} & ImgParamsProps;

function ImgParamsTextField({ paramsKey, onChange }: ImgParamsProps) {
  return (
    <TextField
      variant="outlined"
      id={paramsKey}
      {...paramsKeyToSpread(paramsKey)}
      fullWidth
      onChange={(e) => onChange({ value: e.target.value })}
    />
  );
}

function ImgParamsRange({
  suggestRange,
  paramsKey,
  onChange
}: ImgParamsRangeProps) {
  const [min, max] = suggestRange;
  // const min = suggestRange[0];
  // const max = suggestRange[0];
  const p = paramsKeyToSpread(paramsKey);
  const [value, setValue] = useState<number | string | Array<number | string>>(
    p.defaultValue
  );

  const handleSliderChange = (
    _event: React.ChangeEvent<{}>,
    newValue: number | number[]
  ) => {
    setValue(newValue);
    onChange({ value: newValue as number });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue =
      event.target.value === '' ? '' : Number(event.target.value);
    setValue(newValue);
    onChange({ value: newValue });
  };

  const handleBlur = () => {
    if (value < min) {
      setValue(min);
    } else if (max && value > max) {
      setValue(max);
    }
  };

  return (
    <Box display="flex" flexDirection="row" alignItems="center">
      <Box flexGrow={1} p={1}>
        <Slider
          value={typeof value === 'number' ? value : 0}
          onChange={handleSliderChange}
          aria-labelledby="input-slider"
          min={min}
          max={max}
        />
      </Box>
      <Box p={1}>
        <Input
          // :className={classes.input}
          value={value}
          {...p}
          margin="dense"
          onChange={handleInputChange}
          onBlur={handleBlur}
          inputProps={{
            // step: 10,
            min: min,
            max: max,
            type: 'number',
            'aria-labelledby': 'input-slider'
          }}
        />
      </Box>
    </Box>
  );
}

function ImgParamsColor() {
  return <div />;
}

export default function ImgParams(props: ImgParamsProps) {
  const suggestRange = paramsKeyToRange(props.paramsKey);
  if (suggestRange) {
    return <ImgParamsRange suggestRange={suggestRange} {...props} />;
  } else if (paramsKeyIsColor(props.paramsKey)) {
    return <ImgParamsColor />;
  }
  return <ImgParamsTextField {...props} />;
}
