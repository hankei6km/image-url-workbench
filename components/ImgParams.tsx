import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { SketchPicker } from 'react-color';
import {
  paramsKeyToSpread,
  paramsKeyToRange,
  paramsKeyIsColor,
  paramsKeyToList
} from '../utils/imgParamsUtils';

const useStyles = makeStyles(() => ({
  // root: {
  //   '& > *': {
  //     margin: theme.spacing(1),
  //     width: '25ch'
  //   }
  // },
  colorSample: {
    width: 30,
    height: 30,
    backgroundColor: 'white'
  }
}));

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

type ImgParamsListProps = {
  possibleValues: string[];
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
  const { defaultValue, ...p } = paramsKeyToSpread(paramsKey);
  const [value, setValue] = useState<number | string | Array<number | string>>(
    defaultValue
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

function ImgParamsColor({ paramsKey, onChange }: ImgParamsProps) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState('');
  const [value, setValue] = useState('FF000000'); // ARGB

  const p = paramsKeyToSpread(paramsKey);

  // Button のラベルは後で調整
  return (
    <Box display="flex" flexDirection="row" alignItems="center">
      <Box display="flex" alignItems="center">
        <Button onClick={() => setOpen(true)}>{p.label}</Button>
      </Box>
      <Box px={1} display="flex" alignItems="center">
        <svg onClick={() => setOpen(true)} className={classes.colorSample}>
          <polygon points="0,0 10,0, 10,10 0,10 0,0" fill="black" />
          <polygon points="10,10 20,10, 20,20 10,20 10,10" fill="black" />
          <polygon points="20,20 30,20, 30,30 20,30 20,20" fill="black" />
          <polygon points="20,0 30,0, 30,10 20,10 20,0" fill="black" />
          <polygon points="0,20 10,20, 10,30 0,30 0,20" fill="black" />
          <polygon
            points="0,0 30,0, 30,30 0,30 0,0"
            fill={`#${value.slice(2, 8)}${value.slice(0, 2)}`}
          />
        </svg>
      </Box>
      <Dialog
        aria-labelledby={`color picker for ${p.label}`}
        open={open}
        onClose={() => {
          setOpen(false);
          onChange({ value: value });
        }}
        BackdropProps={{
          invisible: true
        }}
      >
        <SketchPicker
          color={color}
          onChange={(color: any) => {
            console.log(color);
            setColor(color.rgb);
            setValue(
              `${Math.floor(255 * color.rgb.a).toString(16)}${color.hex.slice(
                1
              )}`
            );
          }}
        />
      </Dialog>
    </Box>
  );
}

function ImgParamsList({
  possibleValues,
  paramsKey,
  onChange
}: ImgParamsListProps) {
  const p = paramsKeyToSpread(paramsKey);
  return (
    <Autocomplete
      multiple
      id="tags-standard"
      options={possibleValues}
      getOptionLabel={(option) => option}
      defaultValue={[]}
      onChange={(_event: React.ChangeEvent<{}>, newValue: string[]) => {
        if (newValue) {
          onChange({ value: newValue.join(',') });
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label={p.label}
          placeholder="Favorites"
        />
      )}
    />
  );
}

export default function ImgParams(props: ImgParamsProps) {
  const suggestRange = paramsKeyToRange(props.paramsKey);
  const possibleValues = paramsKeyToList(props.paramsKey);
  if (suggestRange) {
    return <ImgParamsRange suggestRange={suggestRange} {...props} />;
  } else if (paramsKeyIsColor(props.paramsKey)) {
    return <ImgParamsColor {...props} />;
  } else if (possibleValues) {
    return <ImgParamsList possibleValues={possibleValues} {...props} />;
  }
  return <ImgParamsTextField {...props} />;
}
