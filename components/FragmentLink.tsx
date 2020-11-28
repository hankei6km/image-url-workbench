import React, { useState, useContext, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import PreviewContext from '../components/PreviewContext';
import FragmentTextField from '../components/FragmentTextField';

const FragmentLink = () => {
  const previewStateContext = useContext(PreviewContext);
  const [imgUrl, setImgUrl] = useState('');
  const [imgPath, setImgPath] = useState('');

  useEffect(() => {
    try {
      const tmpImgUrl: string[] = [];
      const tmpImgPath: string[] = [];
      previewStateContext.previewSet.forEach((v) => {
        tmpImgUrl.push(v.previewUrl);
        const u = new URL(v.previewUrl);
        tmpImgPath.push(`${u.pathname}${u.search}`);
      });
      setImgUrl(tmpImgUrl.join('\n'));
      setImgPath(tmpImgPath.join('\n'));
    } catch {
      setImgUrl('');
      setImgPath('');
    }
  }, [previewStateContext.previewSet]);

  return (
    <Box>
      <Box p={1}>
        <FragmentTextField label="url" value={imgUrl} />
      </Box>
      <Box p={1}>
        <FragmentTextField label="path" value={imgPath} />
      </Box>
    </Box>
  );
};

export default FragmentLink;
