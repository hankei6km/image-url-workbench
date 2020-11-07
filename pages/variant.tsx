import React, { useState, useContext, useEffect } from 'react';
import ReactDomServer from 'react-dom/server';
import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
// import TurndownService from 'turndown';
import PreviewContext from '../components/PreviewContext';

// const turndownService = new TurndownService();

const markdwonEscapeRegExp = /([[\]\\<>])/g;
const VariantPage = () => {
  const previewStateContext = useContext(PreviewContext);
  //const previewDispatch = useContext(PreviewDispatch);
  const [altText, setAltText] = useState('');
  const [markdown, setMarkdown] = useState('');
  const [imgElement, setImgElement] = useState(
    <img src={previewStateContext.previewImageUrl} alt="" />
  );

  useEffect(() => {
    // markdown は手動でエスケープでも良いのでは?
    setMarkdown(
      `![${altText.replace(markdwonEscapeRegExp, '\\$1')}](${
        previewStateContext.previewImageUrl
      })`
    );
  }, [previewStateContext.previewImageUrl, altText]);

  useEffect(() => {
    setImgElement(
      <img src={previewStateContext.previewImageUrl} alt={altText} />
    );
  }, [previewStateContext.previewImageUrl, altText]);

  return (
    <Layout title="Variant">
      <Container maxWidth="sm">
        <Box>
          <TextField
            fullWidth
            multiline
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
          />
        </Box>
        <Box>
          <TextField fullWidth multiline value={markdown} />
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
