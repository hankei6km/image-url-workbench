import React, { useState, useContext, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
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
            `"\${FILENAME}"-w${imgWidth}."\${EXTENSION}"`,
            '--',
            `"\${1}"${search}`
          ].join(' ')
        );
      });
      // https://stackoverflow.com/questions/965053/extract-filename-and-extension-in-bash
      setMakeVariantsScript(`#!/bin/bash
set -e
FILENAME=$(basename -- "\${1}")
EXTENSION="\${FILENAME##*.}"
FILENAME="\${FILENAME%.*}"
${commands.join('\n')}
`);
    } catch {
      setMakeVariantsScript('');
    }
  }, [previewStateContext.previewSet]);

  return (
    <Box>
      <Box mx={2} p={1}>
        <Typography variant="h6">Usage</Typography>
        <Typography component={'span'} variant="body1">
          <ul>
            <li>
              save following "code" as shell script(ie. `make_variant.sh`).
            </li>
            <li>{`run saved script with <your image bare url>(ie. \`bash make_variant.sh 'https://..../foo.jpg'\`).`}</li>
          </ul>
        </Typography>
      </Box>
      <Box mx={1} p={1}>
        <FragmentTextField
          label="code (make variant images)"
          value={makeVariantsScript}
        />
      </Box>
    </Box>
  );
};

export default FragmentMakeVariants;
