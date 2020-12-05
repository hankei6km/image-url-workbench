import React, { useState, useRef } from 'react';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Card';
import Collapse from '@material-ui/core/Collapse';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CodeIcon from '@material-ui/icons/Code';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { useSnackbar } from 'notistack';
import copyTextToClipboard from '../utils/clipboard';

// type Props = {} & TextFieldProps;
type InnerProps = {
  id?: string;
  defaultOpened?: boolean;
  label: React.ReactNode;
  value: string;
};
type Props = {
  summary?: React.ReactNode;
  naked?: boolean;
} & InnerProps;

const FragmentTextFieldInner = ({
  defaultOpened = false,
  label,
  value,
  ...others
}: InnerProps) => {
  const inputRef = useRef<HTMLTextAreaElement>();
  const [open, setOpen] = useState(defaultOpened);
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Box>
      <Box display="flex" alignItems="center">
        <Box flexGrow="1">
          <Typography variant="body1">{label}</Typography>
        </Box>
        <IconButton onClick={() => setOpen(!open)}>
          <CodeIcon fontSize="small" />
        </IconButton>
        <IconButton
          onClick={() => {
            copyTextToClipboard(value).then(
              () => {
                enqueueSnackbar('The code has been copied.', {
                  variant: 'success'
                });
              },
              (err) => {
                enqueueSnackbar(`error in cpoing the code: ${err.message} `, {
                  variant: 'error'
                });
              }
            );
          }}
        >
          <FileCopyIcon fontSize="small" />
        </IconButton>
      </Box>
      <Collapse in={open}>
        <TextField
          inputRef={inputRef}
          variant="outlined"
          fullWidth={true}
          multiline={true}
          value={value}
          onSelect={(_e) => {
            if (
              inputRef &&
              (inputRef as React.MutableRefObject<HTMLTextAreaElement>).current
            ) {
              (inputRef as React.MutableRefObject<
                HTMLTextAreaElement
              >).current.select();
            }
          }}
          {...others}
        />
      </Collapse>
    </Box>
  );
};

const FragmentTextField = ({
  summary = '',
  naked = false,
  ...others
}: Props) => {
  if (naked) {
    return <FragmentTextFieldInner {...others} />;
  }
  return (
    <Box>
      <Paper>
        <Box mx={1} p={1}>
          <Box>{summary}</Box>
          <Box my={1}>
            <FragmentTextFieldInner {...others} />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default FragmentTextField;
