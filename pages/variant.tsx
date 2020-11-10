import React, { useState, useContext, useEffect, useRef } from 'react';
import ReactDomServer from 'react-dom/server';
import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import unified from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import rehypeToRemark from 'rehype-remark';
import remarkStringify from 'remark-stringify';
import rehypeSanitize from 'rehype-sanitize';
import PreviewContext from '../components/PreviewContext';
// import VariantMarkdown from '../components/VariantMarkdown';

const processorHtml = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeSanitize)
  .use(rehypeStringify)
  .freeze();

const processorMarkdown = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeSanitize)
  .use(rehypeToRemark)
  .use(remarkStringify)
  .freeze();

const VariantPage = () => {
  const previewStateContext = useContext(PreviewContext);
  //const previewDispatch = useContext(PreviewDispatch);
  const [altText, setAltText] = useState('');
  const [linkText, setLinkText] = useState('');
  const [newTab, setNewTab] = useState(false);
  const [imgHtml, setImgHtml] = useState('');
  const [imgMarkdown, setImgMarkdown] = useState('');
  const htmlInputRef = useRef<HTMLTextAreaElement>();
  const markdownInputRef = useRef<HTMLTextAreaElement>();

  useEffect(() => {
    const imgElement = (
      <img src={previewStateContext.previewImageUrl} alt={altText} />
    );
    const t = newTab
      ? {
          target: '_blank',
          rel: 'noopener noreferrer'
        }
      : {};
    const elm = linkText ? (
      <a href={linkText} {...t}>
        {imgElement}
      </a>
    ) : (
      imgElement
    );
    const html = ReactDomServer.renderToStaticMarkup(elm);
    processorHtml.process(html, (err, file) => {
      if (err) {
        console.error(err);
      }
      setImgHtml(String(file));
    });
    processorMarkdown.process(html, (err, file) => {
      if (err) {
        //console.error(reporter(file)); // 今回の利用ではここでデバッグ用の情報は表示されなさそう
      }
      setImgMarkdown(String(file).trimEnd());
    });
  }, [previewStateContext.previewImageUrl, altText, linkText, newTab]);

  return (
    <Layout title="Variant">
      <Container maxWidth="sm">
        <Box p={1}>
          <TextField
            label="alt text"
            fullWidth
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
          />
        </Box>
        <Box p={1} display="flex" flexDirection="row">
          <Box flexGrow={1} mr={1}>
            <TextField
              label="link"
              fullWidth
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
            />
          </Box>
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={newTab}
                  onChange={(e) => {
                    setNewTab(e.target.checked);
                  }}
                  color="primary"
                  name="newTab"
                  inputProps={{ 'aria-label': `switch open link in new tab` }}
                />
              }
              label="new tab"
            />
          </Box>
        </Box>
        <Box p={1}>
          <TextField
            label="html"
            variant="outlined"
            fullWidth
            multiline
            value={imgHtml}
            inputRef={htmlInputRef}
            onSelect={(_e) => {
              if (htmlInputRef && htmlInputRef.current) {
                htmlInputRef.current.select();
              }
            }}
          />
        </Box>
        <Box p={1}>
          <TextField
            label="markdown"
            variant="outlined"
            fullWidth
            multiline
            value={imgMarkdown}
            inputRef={markdownInputRef}
            onSelect={(_e) => {
              if (markdownInputRef && markdownInputRef.current) {
                markdownInputRef.current.select();
              }
            }}
          />
        </Box>
      </Container>
    </Layout>
  );
};

export default VariantPage;
