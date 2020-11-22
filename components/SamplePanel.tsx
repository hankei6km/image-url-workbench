import React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import {
  BuiltinSampleImages,
  SampleImageBuildParametersSet
} from '../src/sample';
import {
  imgUrlParamsMergeObject,
  imgUrlParamsToString
} from '../utils/imgParamsUtils';

type Props = {
  onSelect: ({ value }: { value: string }) => void;
};

const SamplePanel = ({ onSelect }: Props) => {
  return (
    <Box display="flex" flexDirection="row" overflow="auto">
      {BuiltinSampleImages.map((v, idx) => {
        const q = imgUrlParamsMergeObject(
          [],
          SampleImageBuildParametersSet[0].parameters
        );
        const s = imgUrlParamsToString(q);
        const paramsString = s ? `?${s}` : '';
        return (
          <Box key={idx}>
            <Button
              onClick={() => {
                // setImageBaseUrl(v.imageUrl);
                onSelect({ value: v.imageUrl });
              }}
            >
              <img
                src={`${v.imageUrl}${paramsString}`}
                alt="sample"
                width={160}
                height={90}
              />
            </Button>
          </Box>
        );
      })}
    </Box>
  );
};

export default SamplePanel;
