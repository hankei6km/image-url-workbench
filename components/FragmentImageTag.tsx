import React, { useState, useContext, useEffect } from 'react';
import ReactDomServer from 'react-dom/server';
import Box from '@material-ui/core/Box';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import unified from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import format from 'rehype-format';
import rehypeSanitize from 'rehype-sanitize';
import PreviewContext, {
  PreviewDispatch,
  getTargetItemIndex,
  breakPointValue
} from '../components/PreviewContext';
import DebTextField from '../components/DebTextField';
import FragmentTextField from '../components/FragmentTextField';
import { ImgParamsValues } from '../utils/imgParamsUtils';
import merge from 'deepmerge';
import gh from 'hast-util-sanitize/lib/github.json';
import { Schema } from 'hast-util-sanitize';
import CodePenDefineForm from '../components/CodePen';
import TryItOn from '../components/TryItOn';

const schema = merge(gh, {
  tagNames: ['picture', 'source'],
  attributes: { source: ['srcSet', 'sizes'], img: ['srcSet', 'sizes'] }
});
const processorHtml = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeSanitize, (schema as unknown) as Schema)
  .use(format)
  .use(rehypeStringify)
  .freeze();

const FragmentImageTag = () => {
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
          .map(({ previewUrl, imgWidth, media }, i) => {
            const mw = breakPointValue(media, imgWidth);
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
    const dpr = previewStateContext.previewSet.some(
      ({ imgDispDensity }) => imgDispDensity !== 1
    );

    const srcSet: string[] = previewStateContext.previewSet.map(
      ({ previewUrl, imgWidth, imgDispDensity }) =>
        dpr ? `${previewUrl} ${imgDispDensity}x` : `${previewUrl} ${imgWidth}w`
    );
    const sizes: string[] = previewStateContext.previewSet.map(
      ({ imgWidth, media }) =>
        `(min-width: ${breakPointValue(media, imgWidth)}px) ${imgWidth}px`
    );
    const imgElement = (
      <img
        src={defaultItem.previewUrl}
        srcSet={srcSet.length > 1 ? srcSet.join(', ') : undefined}
        sizes={!dpr && sizes.length > 1 ? sizes.join(', ') : undefined}
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
  }, [previewStateContext.previewSet, defaultItem, altText, linkText, newTab]);

  useEffect(() => {
    previewDispatch({
      type: 'setTagFragment',
      payload: [altText, linkText, newTab]
    });
  }, [previewDispatch, altText, linkText, newTab]);

  return (
    <Box mx={1}>
      <Box p={1}>
        <TryItOn
          title="CodePen"
          linkButtons={[
            <CodePenDefineForm
              title="picture tag"
              html={pictureHtml}
              buttonLabel={'picture tag'}
              buttonProps={{
                color: 'primary',
                variant: 'contained',
                disableElevation: true,
                endIcon: <OpenInNewIcon />
              }}
            />,
            <CodePenDefineForm
              title="img tag"
              html={imgHtml}
              buttonLabel={'img tag'}
              buttonProps={{
                color: 'primary',
                variant: 'contained',
                disableElevation: true,
                endIcon: <OpenInNewIcon />
              }}
            />
          ]}
        />
      </Box>
      <Box p={1} mb={2}>
        <Accordion elevation={0}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`optional parameters panel`}
            IconButtonProps={{ edge: 'start' }}
          >
            <Typography variant="body1">Optional fields</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box width="100%">
              <Box px={2} mt={-1} mb={2} width="100%">
                <DebTextField
                  label="alt text"
                  fullWidth
                  value={altText}
                  onChangeValue={({ value }) => setAltText(value)}
                />
              </Box>
              <Box px={2} mt={3} display="flex" flexDirection="row">
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
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
      <Box>
        <Box p={1}>
          <FragmentTextField naked label="picture tag" value={pictureHtml} />
        </Box>
        <Box p={1}>
          <FragmentTextField naked label="img tag" value={imgHtml} />
        </Box>
      </Box>
    </Box>
  );
};

export default FragmentImageTag;
