import React, { useRef } from 'react';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';

type Props = {} & TextFieldProps;

const FragmentTextField = ({
  inputRef = useRef<HTMLTextAreaElement>(),
  variant = 'outlined',
  fullWidth = true,
  multiline = true,
  onSelect = (_e) => {},
  ...others
}: Props) => {
  return (
    <TextField
      inputRef={inputRef}
      variant={variant}
      fullWidth={fullWidth}
      multiline={multiline}
      onSelect={(e) => {
        if (
          inputRef &&
          (inputRef as React.MutableRefObject<HTMLTextAreaElement>).current
        ) {
          (inputRef as React.MutableRefObject<
            HTMLTextAreaElement
          >).current.select();
        }
        onSelect(e);
      }}
      {...others}
    />
  );
};

export default FragmentTextField;
