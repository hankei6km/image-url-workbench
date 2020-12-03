import React, { useState, useContext, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import { basename, extname } from 'path';
import PreviewContext from '../components/PreviewContext';
import FragmentTextField from '../components/FragmentTextField';
import shellescape from 'shell-escape';

const FragmentDownload = () => {
  const previewStateContext = useContext(PreviewContext);
  const [downloadImagesCommands, setDownloadImagesCommands] = useState('');

  useEffect(() => {
    try {
      const commands: string[] = [];
      previewStateContext.previewSet.forEach((v) => {
        const u = new URL(v.previewUrl);
        const fileName = basename(u.pathname);
        const extName = extname(fileName);
        const fileBaseName = fileName.slice(
          0,
          fileName.length - extName.length
        );
        commands.push(
          `${shellescape([
            'curl',
            '-fL',
            '-o',
            `${fileBaseName}-w${v.imgWidth}${extName}`,
            v.previewUrl
          ])}`
        );
      });
      setDownloadImagesCommands(commands.join('\n'));
    } catch {
      setDownloadImagesCommands('');
    }
  }, [previewStateContext.previewSet]);

  return (
    <Box>
      <Box p={1}>
        <FragmentTextField
          label="commands (download images)"
          value={downloadImagesCommands}
        />
      </Box>
    </Box>
  );
};

export default FragmentDownload;
