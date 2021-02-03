import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputIcon from '@material-ui/icons/Input';

type Props = {
  label: string;
  defaultValue?: string;
  disabled?: boolean;
  onSelect: ({ value }: { value: string }) => void;
};

const ImportPanel = ({ label, onSelect }: Props) => {
  const [importValue, setImportValue] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);

  return (
    <Box display="flex" alignItems="flex-start">
      <Box flexGrow="1">
        <TextField
          id="import-json"
          label={label}
          // defaultValue={''}
          // value={value}
          fullWidth
          multiline
          rows={5}
          variant="outlined"
          onChange={(e) => {
            const newValue = e.target.value;
            try {
              JSON.parse(newValue);
              setImportValue(newValue);
              setButtonDisabled(false);
            } catch (_err) {
              setButtonDisabled(true);
            }
            // onChange({ value: validatedValue(newValue) });
          }}
        />
      </Box>
      <Box p={1}>
        <Button
          color="primary"
          variant="contained"
          size="small"
          startIcon={<InputIcon fontSize="small" />}
          disabled={buttonDisabled}
          disableElevation={true}
          onClick={() => {
            onSelect({ value: importValue });
          }}
        >
          Import
        </Button>
      </Box>
    </Box>
  );
};

export default ImportPanel;
