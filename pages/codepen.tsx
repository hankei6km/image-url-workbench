import React, { useState, useContext, useEffect } from 'react';
import ReactDomServer from 'react-dom/server';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
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
import ImgPreview from '../components/ImgPreview';

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

const useStyles = makeStyles((theme) => ({
  imagePreview: {
    width: 300,
    height: 150,
    [theme.breakpoints.up('sm')]: {
      width: 400,
      height: 200
    },
    '& > .MuiBox-root': {
      width: 300,
      height: 150,
      [theme.breakpoints.up('sm')]: {
        width: 400,
        height: 200
      }
    }
  }
}));

const CodePenPage = () => {
  const previewStateContext = useContext(PreviewContext);
  const previewDispatch = useContext(PreviewDispatch);
  const classes = useStyles();

  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);

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
    // const withoutDefault = previewStateContext.previewSet.filter(
    //   ({ itemKey }) => itemKey !== defaultItem.itemKey
    // );
    const srcSet: string[] = previewStateContext.previewSet.map(
      ({ previewUrl, imgWidth }) => `${previewUrl} ${imgWidth}w`
    );
    const sizes: string[] = previewStateContext.previewSet.map(
      ({ imgWidth, media }) =>
        `(min-width: ${breakPointValue(media, imgWidth)}px) ${imgWidth}px`
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
  }, [previewStateContext.previewSet, defaultItem, altText, linkText, newTab]);

  useEffect(() => {
    previewDispatch({
      type: 'setTagFragment',
      payload: [altText, linkText, newTab]
    });
  }, [previewDispatch, altText, linkText, newTab]);

  return (
    <Layout title="CodePen">
      <Container maxWidth="md">
        <Box my={1} p={1}>
          <Typography variant="h5">{'Try it on CodePen'}</Typography>
          <Box p={1} display="flex" alignItems="center">
            <Typography variant="body1">{'open with: '}</Typography>
            <Box p={1}>
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
              />
            </Box>
            <Box p={1}>
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
            </Box>
          </Box>
          <Box p={1}>
            <Card elevation={0}>
              <CardHeader
                titleTypographyProps={{ variant: 'body2' }}
                title={
                  <Box display="flex">
                    <Box>
                      <Typography variant="body2">Default Image</Typography>
                    </Box>
                    <Box ml={1}>
                      <Typography variant="body2">
                        {imgWidth > 0 ? `(${imgWidth} x ${imgHeight})` : ''}
                      </Typography>
                    </Box>
                    {imgWidth > 0 &&
                      previewStateContext.previewSet.length > 1 &&
                      ((n) => {
                        switch (n) {
                          case 2:
                            return <Box ml={1}>{'and 1 Image'}</Box>;
                        }
                        return <Box ml={1}>{`and ${n - 1} Images`}</Box>;
                      })(previewStateContext.previewSet.length)}
                  </Box>
                }
              />
              <CardContent
                className={classes.imagePreview}
                // onClick={() => {
                //   router.push('/render');
                // }}
              >
                <Box>
                  <ImgPreview
                    previewUrl={defaultItem.previewUrl}
                    {...{
                      fitMode: 'landscape',
                      imgGrow: 'none',
                      width: undefined,
                      height: undefined
                    }}
                    skeleton={true}
                    onSize={({ w, h }) => {
                      setImgWidth(w);
                      setImgHeight(h);
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>
          <Box mx={1} mb={2}>
            <Accordion elevation={0}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`optional parameters panel`}
                IconButtonProps={{ edge: 'start' }}
              >
                <Typography variant="body2">Optional fields</Typography>
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
          <Box mx={1} mt={1} mb={2}>
            <Accordion elevation={0}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`optional parameters panel`}
                IconButtonProps={{ edge: 'start' }}
              >
                <Typography variant="body2">Html code</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box width="100%">
                  <Box p={1}>
                    <FragmentTextField label="picture" value={pictureHtml} />
                  </Box>
                  <Box p={1}>
                    <FragmentTextField label="img" value={imgHtml} />
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default CodePenPage;
