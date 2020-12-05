import React, { useState, useRef } from 'react';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CodeIcon from '@material-ui/icons/Code';
import FileCopyIcon from '@material-ui/icons/FileCopy';
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
            copyTextToClipboard(value);
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
      <Card>
        {summary && <CardHeader title={summary} />}
        <CardContent>
          <FragmentTextFieldInner {...others} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default FragmentTextField;
