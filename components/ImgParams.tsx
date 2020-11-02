import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { SketchPicker } from 'react-color';
import {
  paramsKeyParameters,
  paramsKeyToSpread,
  expectToRange,
  expectIsColor,
  expectToList,
  ParamsExpect,
  pruneExpects
} from '../utils/imgParamsUtils';
import { Switch } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  // root: {
  //   '& > *': {
  //     margin: theme.spacing(1),
  //     width: '25ch'
  //   }
  // },
  root: {
    '& > .MuiBox-root >  *': {
      textAlign: 'left',
      textTransform: 'none'
    },
    '& > * > .MuiBox-root >  *': {
      textAlign: 'left',
      textTransform: 'none'
    }
  },
  controlOuterMedia: {
    flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(1),
      flexDirection: 'row',
      alignItems: 'center'
    }
  },
  labelOuterMedia: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    marginBottom: theme.spacing(-1),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(1),
      marginBottom: 0,
      width: 120
    }
  },
  sliderOuterMedia: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    marginBottom: theme.spacing(-2),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      flexGrow: 1,
      mx: 0,
      width: undefined
    }
  },
  rangeInputOuter: {
    padding: theme.spacing(1),
    width: 70,
    [theme.breakpoints.up('sm')]: {}
  },
  colorButtonOuter: {
    width: '100%',
    paddingLeft: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      width: 120
    }
  },
  colorSampleOuter: {
    padding: 0,
    margin: 0,
    width: 32,
    height: 32
  },
  colorSample: {
    width: 30,
    height: 30,
    backgroundColor: 'white'
  }
}));

export type ImgUrlParamsOnChangeEvent = { value: string | number | boolean };

type ImgParamsProps = {
  paramsKey: string;
  onChange: (e: ImgUrlParamsOnChangeEvent) => void;
};

type ImgParamsTextFieldProps = {
  paramsExpect: ParamsExpect;
  //};
} & ImgParamsProps;

type ImgParamsRangeProps = {
  paramsExpect: ParamsExpect;
  suggestRange: [number, number | undefined];
} & ImgParamsProps;

type ImgParamsColorProps = {
  paramsExpect: ParamsExpect;
} & ImgParamsProps;

type ImgParamsListProps = {
  paramsExpect: ParamsExpect;
  possibleValues: string[];
} & ImgParamsProps;

type ImgParamsEnabledProps = {
  enabled: boolean;
} & ImgParamsProps;

function ImgParamsTextField({
  paramsKey,
  paramsExpect,
  onChange
}: ImgParamsTextFieldProps) {
  return (
    <TextField
      variant="outlined"
      id={`${paramsKey}(${paramsExpect.type})`}
      {...paramsKeyToSpread(paramsKey, paramsExpect)}
      fullWidth
      onChange={(e) => onChange({ value: e.target.value })}
    />
  );
}

function ImgParamsRange({
  paramsKey,
  paramsExpect,
  suggestRange,
  onChange
}: ImgParamsRangeProps) {
  const [min, max] = suggestRange;
  const classes = useStyles();
  const { defaultValue, ...p } = paramsKeyToSpread(paramsKey, paramsExpect);
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

  // Typography のラベルの色は後で調整(TextFieldのラベル色はどこで決まる?)
  return (
    <Box
      className={classes.root}
      display="flex"
      flexDirection="row"
      alignItems="center"
    >
      <Box display="flex" className={classes.controlOuterMedia}>
        <Box className={classes.labelOuterMedia}>
          <Typography
            variant="button"
            display="block"
            gutterBottom
            style={{ width: '100%' }}
          >
            {p.label}
          </Typography>
        </Box>
        <Box className={classes.sliderOuterMedia}>
          <Slider
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            min={min}
            max={max}
            style={{ width: '100%' }}
          />
        </Box>
      </Box>
      <Box className={classes.rangeInputOuter}>
        <Input
          // :className={classes.input}
          value={value}
          {...p}
          margin="dense"
          fullWidth
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

function ImgParamsColor({
  paramsKey,
  paramsExpect,
  onChange
}: ImgParamsColorProps) {
  const p = paramsKeyToSpread(paramsKey, paramsExpect);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState('');
  // TODO: defaultValue の書式によっては変換が必要なはず
  const [value, setValue] = useState<string>(`${p.defaultValue}` || 'FF000000'); // ARGB

  // Button のラベルの色は後で調整(TextFieldのラベル色はどこで決まる?)
  return (
    <Box
      className={classes.root}
      display="flex"
      flexDirection="row"
      alignItems="center"
    >
      <Box
        display="flex"
        alignItems="center"
        className={classes.colorButtonOuter}
      >
        <Button onClick={() => setOpen(true)}>{p.label}</Button>
      </Box>
      <Box
        px={1}
        display="flex"
        alignItems="center"
        className={classes.colorSampleOuter}
      >
        <Box border={1} className={classes.colorSampleOuter}>
          <svg onClick={() => setOpen(true)} className={classes.colorSample}>
            <polygon points="0,0 10,0, 10,5 0,5 0,0" fill="#eaeaea" />
            <polygon points="10,5 20,5, 20,15 10,15 10,5" fill="#eaeaea" />
            <polygon points="20,15 30,15, 30,25 20,25 20,15" fill="#eaeaea" />
            <polygon points="20,0 30,0, 30,5 20,5 20,0" fill="#eaeaea" />
            <polygon points="0,15 10,15, 10,25 0,25 0,15" fill="#eaeaea" />
            <polygon points="10,25 20,25, 20,30 10,30 10,25" fill="#eaeaea" />
            <polygon
              points="0,0 30,0, 30,30 0,30 0,0"
              fill={`#${value.slice(2, 8)}${value.slice(0, 2)}`}
            />
          </svg>
        </Box>
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
            // console.log(color);
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
  paramsExpect,
  paramsKey,
  onChange
}: ImgParamsListProps) {
  const p = paramsKeyToSpread(paramsKey, paramsExpect);
  return (
    <Autocomplete
      multiple
      id={`keyword-${paramsKey}`}
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
          placeholder={paramsKey}
        />
      )}
    />
  );
}

export function ImgParamsEnabled({
  enabled,
  paramsKey,
  onChange
}: ImgParamsEnabledProps) {
  const [checked, setChecked] = useState(enabled);

  return (
    <Switch
      checked={checked}
      onChange={(e) => {
        setChecked(e.target.checked);
        onChange({ value: e.target.checked });
      }}
      color="primary"
      name={paramsKey}
      inputProps={{ 'aria-label': `switch enabled ${paramsKey}` }}
    />
  );
}

export default function ImgParams(props: ImgParamsProps) {
  const p = paramsKeyParameters(props.paramsKey);
  if (p) {
    return (
      <div>
        {pruneExpects(p.expects).map((v: ParamsExpect, i: number) => {
          const suggestRange = expectToRange(v);
          const possibleValues = expectToList(v);
          const key = `${props.paramsKey}${v.type}${i}`;
          if (suggestRange) {
            return (
              <ImgParamsRange
                key={key}
                paramsExpect={v}
                suggestRange={suggestRange}
                {...props}
              />
            );
          } else if (expectIsColor(v)) {
            return <ImgParamsColor key={key} paramsExpect={v} {...props} />;
          } else if (possibleValues) {
            return (
              <ImgParamsList
                key={key}
                paramsExpect={v}
                possibleValues={possibleValues}
                {...props}
              />
            );
          }
          return <ImgParamsTextField key={key} paramsExpect={v} {...props} />;
        })}
      </div>
    );
  }
  return <div></div>;
}
