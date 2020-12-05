import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import PreviewContext from '../components/PreviewContext';
import FragmentTextField from '../components/FragmentTextField';
import shellescape from 'shell-escape';

const useStyles = makeStyles((theme) => ({
  root: {
    '& code': {
      padding: '.2em .4em',
      margin: 0,
      backgroundColor: theme.palette.grey[200], // TODO: dark 対応(このままだと多分見えにくい)
      borderRadius: 6
    }
  }
}));

const FragmentMake = () => {
  const classes = useStyles();
  const previewStateContext = useContext(PreviewContext);
  const [makeVariantsScript, setMakeVariantsScript] = useState('');
  const [assetHostName, setAssetHostName] = useState('');

  useEffect(() => {
    try {
      const u = new URL(previewStateContext.previewSet[0].previewUrl);
      u.pathname = '';
      u.search = '';
      setAssetHostName(`${u.toString()}path/to/foo.jpg`);
    } catch {
      setAssetHostName('');
    }
  }, [previewStateContext.previewSet]);

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
    <Box mx={1} className={classes.root}>
      <Box mx={1} p={1}>
        <Typography variant="h6">Usage</Typography>
        <Typography component={'span'} variant="body1">
          <ul>
            <li>
              save following "code" as shell script. (ie.{' '}
              <code>make_variant.sh</code>)
            </li>
            <li>
              {'run saved script with "your image bare url". (ie. '}
              <code>{`bash make_variant.sh '${assetHostName}'`}</code>)
            </li>
          </ul>
        </Typography>
      </Box>
      <Box p={1}>
        <FragmentTextField
          defaultOpened
          label="code"
          value={makeVariantsScript}
        />
      </Box>
    </Box>
  );
};

export default FragmentMake;
