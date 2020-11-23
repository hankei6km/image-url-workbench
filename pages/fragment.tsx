import React, { useState, useContext, useEffect } from 'react';
import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import PreviewContext from '../components/PreviewContext';
import FragmentTextField from '../components/FragmentTextField';
import FragmentParams from '../components/FragmentParams';
import FragmentTag from '../components/FragmentTag';

export function FragmentPanel({
  groupName,
  children
}: {
  groupName: string;
  children: React.ReactNode;
}) {
  return (
    <Box my={1}>
      <Paper elevation={0}>
        <Box p={1}>
          <Typography variant="h6">{groupName}</Typography>
        </Box>
        <Box pl={1}>{children}</Box>
      </Paper>
    </Box>
  );
}

const FragmentPage = () => {
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
      setImgUrl(JSON.stringify(tmpImgUrl, null, ' '));
      setImgPath(JSON.stringify(tmpImgPath, null, ' '));
    } catch {
      setImgUrl('');
      setImgPath('');
    }
  }, [previewStateContext.previewSet]);

  return (
    <Layout title="Fragment">
      <Container maxWidth="sm">
        <Box py={1}>
          <FragmentPanel groupName="Link">
            <Box p={1}>
              <FragmentTextField label="url" value={imgUrl} />
            </Box>
            <Box p={1}>
              <FragmentTextField label="path" value={imgPath} />
            </Box>
          </FragmentPanel>
          <FragmentPanel groupName="Parameters">
            <FragmentParams />
          </FragmentPanel>
          <FragmentPanel groupName="Tag">
            <FragmentTag />
          </FragmentPanel>
        </Box>
      </Container>
    </Layout>
  );
};

export default FragmentPage;
