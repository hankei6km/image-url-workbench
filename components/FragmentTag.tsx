import React, { useState, useContext, useEffect } from 'react';
import ReactDomServer from 'react-dom/server';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import unified from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import rehypeToRemark from 'rehype-remark';
import remarkStringify from 'remark-stringify';
import rehypeSanitize from 'rehype-sanitize';
import PreviewContext, {
  PreviewDispatch,
  getTargetItemIndex
} from '../components/PreviewContext';
import DebTextField from '../components/DebTextField';
import FragmentTextField from '../components/FragmentTextField';
import { ImgParamsValues } from '../utils/imgParamsUtils';
import merge from 'deepmerge';
import gh from 'hast-util-sanitize/lib/github.json';
import { Schema } from 'hast-util-sanitize';

const schema = merge(gh, { attributes: { img: ['srcSet'] } });
const processorHtml = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeSanitize, (schema as unknown) as Schema)
  .use(rehypeStringify)
  .freeze();

const processorMarkdown = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeSanitize)
  .use(rehypeToRemark)
  .use(remarkStringify)
  .freeze();

const FragmentTag = () => {
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
  const [imgHtml, setImgHtml] = useState('');
  const [imgMarkdown, setImgMarkdown] = useState('');

  useEffect(() => {
    const idx = getTargetItemIndex(
      previewStateContext.previewSet,
      previewStateContext.defaultTargetKey
    );
    if (idx >= 0) {
      setEditItem({
        previewUrl: previewStateContext.previewSet[idx].previewUrl,
        imageParams: previewStateContext.previewSet[idx].imageParams
      });
    }
  }, [previewStateContext.previewSet, previewStateContext.editTargetKey]);

  useEffect(() => {
    const srcSet: string[] = previewStateContext.previewSet.map(
      ({ previewUrl, imgWidth }) => `${previewUrl} ${imgWidth}w`
    );
    const imgElement = (
      <img
        src={editItem.previewUrl}
        srcSet={srcSet.length > 1 ? srcSet.join(',\n') : undefined}
        alt={altText}
      />
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
  }, [previewStateContext.previewSet, editItem, altText, linkText, newTab]);

  useEffect(() => {
    previewDispatch({
      type: 'setTagFragment',
      payload: [altText, linkText, newTab]
    });
  }, [previewDispatch, altText, linkText, newTab]);

  return (
    <Box>
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
    </Box>
  );
};

export default FragmentTag;