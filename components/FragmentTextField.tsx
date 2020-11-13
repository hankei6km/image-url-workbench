import React, { useRef } from 'react';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';

type Props = {} & TextFieldProps;

const FragmentTextField = ({
  inputRef = useRef<HTMLTextAreaElement>(),
  onSelect = (_e) => {},
  ...others
}: Props) => {
  return (
    <TextField
      inputRef={inputRef}
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
