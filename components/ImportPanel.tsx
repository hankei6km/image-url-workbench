import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import ImgBaseUrl, {
  BaseUrlOnChangeEvent,
  BaseUrlOnEnterKeyEvent
} from '../components/ImgBaseUrl';

type Props = {
  label: string;
  onSelect: ({ value }: { value: string }) => void;
};

const ImportPanel = ({ label, onSelect }: Props) => {
  const [imageBaseUrl, setImageBaseUrl] = useState('');

  return (
    <Box display="flex" alignItems="flex-end">
      <Box flexGrow="1">
        <ImgBaseUrl
          label={label}
          baseUrl={imageBaseUrl}
          onEnterKey={(e: BaseUrlOnEnterKeyEvent) => {
            onSelect({ value: e.value });
            setImageBaseUrl('');
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
          disabled={imageBaseUrl === ''}
          onClick={() => {
            onSelect({ value: imageBaseUrl });
            setImageBaseUrl('');
          }}
        >
          New
        </Button>
      </Box>
    </Box>
  );
};

export default ImportPanel;
