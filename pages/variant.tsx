import React, { useState, useContext } from 'react';
import ReactDomServer from 'react-dom/server';
import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import PreviewContext from '../components/PreviewContext';

const VariantPage = () => {
  const previewStateContext = useContext(PreviewContext);
  //const previewDispatch = useContext(PreviewDispatch);
  const [value] = useState(`![](${previewStateContext.previewImageUrl})`);

  const imgElement = <img src={previewStateContext.previewImageUrl} alt="" />;

  return (
    <Layout title="Variant">
      <Container maxWidth="sm">
        <Box>
          <TextField fullWidth multiline value={value} />
        </Box>
        <Box>
          <TextField
            fullWidth
            multiline
            value={ReactDomServer.renderToStaticMarkup(imgElement)}
          />
        </Box>
      </Container>
    </Layout>
  );
};

export default VariantPage;
