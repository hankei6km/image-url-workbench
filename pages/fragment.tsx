import React, { useState, useContext, useEffect } from 'react';
import ReactDomServer from 'react-dom/server';
import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import unified from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import rehypeToRemark from 'rehype-remark';
import remarkStringify from 'remark-stringify';
import rehypeSanitize from 'rehype-sanitize';
import PreviewContext, {
  PreviewDispatch,
  getEditTargetItemIndex
} from '../components/PreviewContext';
import DebTextField from '../components/DebTextField';
import FragmentTextField from '../components/FragmentTextField';
import { ImgParamsValues } from '../utils/imgParamsUtils';

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
  const previewDispatch = useContext(PreviewDispatch);
  const [editItem, setEditItem] = useState<{
    previewUrl: string;
    imageParams: ImgParamsValues;
  }>({
    previewUrl: '',
    imageParams: []
  });
  const [altText, setAltText] = useState(
    previewStateContext.tagFragment.altText
  );
  const [linkText, setLinkText] = useState(
    previewStateContext.tagFragment.linkText
  );
  const [newTab, setNewTab] = useState(previewStateContext.tagFragment.newTab);
  const [imgPath, setImgPath] = useState('');
  const [imgParameters, setImgParameters] = useState('');
  const [imgParametersJson, setImgParametersJson] = useState('');
  const [imgHtml, setImgHtml] = useState('');
  const [imgMarkdown, setImgMarkdown] = useState('');

  useEffect(() => {
    const idx = getEditTargetItemIndex(
      previewStateContext.previewSet,
      previewStateContext.editTargetKey
    );
    if (idx >= 0) {
      setEditItem({
        previewUrl: previewStateContext.previewSet[idx].previewUrl,
        imageParams: previewStateContext.previewSet[idx].imageParams
      });
    }
  }, [previewStateContext.previewSet, previewStateContext.editTargetKey]);

  useEffect(() => {
    try {
      const u = new URL(editItem.previewUrl);
      setImgPath(`${u.pathname}${u.search}`);
      setImgParameters(`${u.search.slice(1)}`);
      const p = editItem.imageParams
        //https://stackoverflow.com/questions/26264956/convert-object-array-to-hash-map-indexed-by-an-attribute-value-of-the-object
        .reduce((m: { [key: string]: string }, v): {
          [key: string]: string;
        } => {
          m[v.key] = v.value;
          return m;
        }, {});
      setImgParametersJson(JSON.stringify(p, null, ' '));
    } catch {
      setImgPath('');
      setImgParameters('');
      setImgParametersJson('');
    }
  }, [editItem]);

  useEffect(() => {
    const imgElement = <img src={editItem.previewUrl} alt={altText} />;
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
  }, [editItem, altText, linkText, newTab]);

  useEffect(() => {
    previewDispatch({
      type: 'setTagFragment',
      payload: [altText, linkText, newTab]
    });
  }, [previewDispatch, altText, linkText, newTab]);

  return (
    <Layout title="Fragment">
      <Container maxWidth="sm">
        <Box py={1}>
          <FragmentPanel groupName="Link">
            <Box p={1}>
              <FragmentTextField label="url" value={editItem.previewUrl} />
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
            <Box p={1}>
              <DebTextField
                label="alt text"
                fullWidth
                value={altText}
                onChangeValue={({ value }) => setAltText(value)}
              />
            </Box>
            <Box p={1} display="flex" flexDirection="row">
              <Box flexGrow={1} mr={1}>
                <DebTextField
                  label="link"
                  fullWidth
                  value={linkText}
                  onChangeValue={({ value }) => setLinkText(value)}
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
                      inputProps={{
                        'aria-label': `switch open link in new tab`
                      }}
                    />
                  }
                  label="new tab"
                />
              </Box>
            </Box>
            <Box p={1}>
              <FragmentTextField label="html" value={imgHtml} />
            </Box>
            <Box p={1}>
              <FragmentTextField label="markdown" value={imgMarkdown} />
            </Box>
          </FragmentPanel>
        </Box>
      </Container>
    </Layout>
  );
};

export default FragmentPage;
