import React, { useState, useContext, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import PreviewContext from '../components/PreviewContext';
import FragmentTextField from '../components/FragmentTextField';
import shellescape from 'shell-escape';

const FragmentMakeVariants = () => {
  const previewStateContext = useContext(PreviewContext);
  const [makeVariantsScript, setMakeVariantsScript] = useState('');

  useEffect(() => {
    try {
      const commands: string[] = [];
      previewStateContext.previewSet.forEach((v) => {
        const u = new URL(v.previewUrl);
        const imgWidth = shellescape([`${v.imgWidth}`]);
        const search = shellescape([u.search]);
        // *** 注意: 以下の配列はエスケープされない   **
        commands.push(
          [
            'curl',
            '-fL',
            '-o',
            `"\${filename}"-w${imgWidth}."\${extension}"`,
            `"\${1}"${search}`
          ].join(' ')
        );
      });
      // https://stackoverflow.com/questions/965053/extract-filename-and-extension-in-bash
      setMakeVariantsScript(`#!/bin/bash
set -e
filename=$(basename -- "\${1}")
extension="\${filename##*.}"
filename="\${filename%.*}"
${commands.join('\n')}
`);
    } catch {
      setMakeVariantsScript('');
    }
  }, [previewStateContext.previewSet]);

  return (
    <Box>
      <Box p={1}>
        <FragmentTextField
          label="code (make variant images)"
          value={makeVariantsScript}
        />
      </Box>
    </Box>
  );
};

export default FragmentMakeVariants;
