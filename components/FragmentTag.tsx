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

const schema = merge(gh, {
  tagNames: ['picture', 'source'],
  attributes: { source: ['srcSet', 'sizes'], img: ['srcSet', 'sizes'] }
});
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

const breakPointValues: number[] = [/* 240, */ 320, 600, 960, 1280, 1920];
function mediaBreakPoint(imgWidth: number): number {
  const idx = breakPointValues.findIndex((v) => v >= imgWidth);
  if (idx >= 0) {
    return breakPointValues[idx];
  }
  return 160;
}

const FragmentTag = () => {
  const previewStateContext = useContext(PreviewContext);
  const previewDispatch = useContext(PreviewDispatch);

  const [defaultItem, setDefaultItem] = useState<{
    itemKey: string;
    previewUrl: string;
    imageParams: ImgParamsValues;
  }>({
    itemKey: '',
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
  const [pictureHtml, setPictureHtml] = useState('');
  const [imgHtml, setImgHtml] = useState('');
  const [imgMarkdown, setImgMarkdown] = useState('');

  useEffect(() => {
    const idx = getTargetItemIndex(
      previewStateContext.previewSet,
      previewStateContext.defaultTargetKey
    );
    if (idx >= 0) {
      setDefaultItem({
        itemKey: previewStateContext.defaultTargetKey,
        previewUrl: previewStateContext.previewSet[idx].previewUrl,
        imageParams: previewStateContext.previewSet[idx].imageParams
      });
    }
  }, [previewStateContext.previewSet, previewStateContext.defaultTargetKey]);

  useEffect(() => {
    const pictureElement = (
      <picture>
        {previewStateContext.previewSet
          .filter(({ itemKey }) => itemKey !== defaultItem.itemKey)
          .map(({ previewUrl, imgWidth }, i) => {
            const mw = mediaBreakPoint(imgWidth);
            return (
              <source
                key={i}
                // src={`${previewUrl}`}
                srcSet={`${previewUrl} ${imgWidth}w`}
                sizes={`(min-width: ${mw}px) ${imgWidth}px`}
                media={`(min-width: ${mw}px)`}
              />
            );
          })}
        <img src={defaultItem.previewUrl} alt={altText} />
      </picture>
    );
    const t = newTab
      ? {
          target: '_blank',
          rel: 'noopener noreferrer'
        }
      : {};
    const elm = linkText ? (
      <a href={linkText} {...t}>
        {pictureElement}
      </a>
    ) : (
      pictureElement
    );
    const html = ReactDomServer.renderToStaticMarkup(elm);
    processorHtml.process(html, (err, file) => {
      if (err) {
        console.error(err);
      }
      setPictureHtml(String(file));
    });
  }, [previewStateContext.previewSet, defaultItem, altText, linkText, newTab]);

  useEffect(() => {
    // const withoutDefault = previewStateContext.previewSet.filter(
    //   ({ itemKey }) => itemKey !== defaultItem.itemKey
    // );
    const srcSet: string[] = previewStateContext.previewSet.map(
      ({ previewUrl, imgWidth }) => `${previewUrl} ${imgWidth}w`
    );
    const sizes: string[] = previewStateContext.previewSet.map(
      ({ imgWidth }) =>
        `(min-width: ${mediaBreakPoint(imgWidth)}px) ${imgWidth}px`
    );
    const imgElement = (
      <img
        src={defaultItem.previewUrl}
        srcSet={srcSet.length > 1 ? srcSet.join(', ') : undefined}
        sizes={sizes.length > 1 ? sizes.join(', ') : undefined}
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
  }, [previewStateContext.previewSet, defaultItem, altText, linkText, newTab]);

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
        <FragmentTextField label="picture" value={pictureHtml} />
      </Box>
      <Box p={1}>
        <FragmentTextField label="img" value={imgHtml} />
      </Box>
      <Box p={1}>
        <FragmentTextField label="markdown" value={imgMarkdown} />
      </Box>
    </Box>
  );
};

export default FragmentTag;
