import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import ImgBaseUrl, {
  BaseUrlOnChangeEvent,
  BaseUrlOnEnterKeyEvent
} from '../components/ImgBaseUrl';
import {
  BuiltinSampleImages,
  SampleImageBuildParametersSet
} from '../src/sample';
import {
  imgUrlParamsMergeObject,
  imgUrlParamsToString
} from '../utils/imgParamsUtils';

type Props = {
  onImport: ({ value }: { value: string }) => void;
};

const ImportPanel = ({ onImport }: Props) => {
  const [imageBaseUrl, setImageBaseUrl] = useState('');

  return (
    <Box>
      <Box display="flex" alignItems="flex-end" my={1}>
        <Box flexGrow="1">
          <ImgBaseUrl
            baseUrl={imageBaseUrl}
            onEnterKey={(e: BaseUrlOnEnterKeyEvent) => {
              onImport({ value: e.value });
              // setImageBaseUrl('');
            }}
            onChange={(e: BaseUrlOnChangeEvent) => setImageBaseUrl(e.value)}
          />
        </Box>
        <Box p={1}>
          <Button
            color="primary"
            variant="contained"
            size="small"
            startIcon={<AddPhotoAlternateIcon fontSize="small" />}
            onClick={() => onImport({ value: imageBaseUrl })}
          >
            New
          </Button>
        </Box>
      </Box>
      <Box display="flex" flexDirection="row">
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
                  onImport({ value: v.imageUrl });
                }}
              >
                <img src={`${v.imageUrl}${paramsString}`} alt="sample" />
              </Button>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default ImportPanel;
