import React, { useState, useContext, useEffect } from 'react';
import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import PreviewContext from '../components/PreviewContext';
import FragmentTextField from '../components/FragmentTextField';
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
  const [imgParameters, setImgParameters] = useState('');
  const [imgParametersJson, setImgParametersJson] = useState('');

  useEffect(() => {
    try {
      const tmpImgUrl: string[] = [];
      const tmpImgPath: string[] = [];
      const tmpImgParameters: string[] = [];
      const tmpImgParametersJson: { [key: string]: string }[] = [];
      previewStateContext.previewSet.forEach((v) => {
        tmpImgUrl.push(v.previewUrl);
        const u = new URL(v.previewUrl);
        tmpImgPath.push(`${u.pathname}${u.search}`);
        tmpImgParameters.push(`${u.search.slice(1)}`);
        const p = v.imageParams
          //https://stackoverflow.com/questions/26264956/convert-object-array-to-hash-map-indexed-by-an-attribute-value-of-the-object
          .reduce((m: { [key: string]: string }, v): {
            [key: string]: string;
          } => {
            m[v.key] = v.value;
            return m;
          }, {});
        tmpImgParametersJson.push(p);
      });
      setImgUrl(JSON.stringify(tmpImgUrl, null, ' '));
      setImgPath(JSON.stringify(tmpImgPath, null, ' '));
      setImgParameters(JSON.stringify(tmpImgParameters, null, ' '));
      setImgParametersJson(JSON.stringify(tmpImgParametersJson, null, ' '));
    } catch {
      setImgUrl('');
      setImgPath('');
      setImgParameters('');
      setImgParametersJson('');
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
            <Box p={1}>
              <FragmentTextField label="query" value={imgParameters} />
            </Box>
            <Box p={1}>
              <FragmentTextField label="json" value={imgParametersJson} />
            </Box>
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
