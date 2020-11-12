import React, {
  useCallback,
  useState,
  useContext,
  useEffect,
  useRef
} from 'react';
import ReactDomServer from 'react-dom/server';
import {
  //GetStaticProps,
  InferGetServerSidePropsType,
  GetServerSideProps
} from 'next';
import Head from 'next/head';
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
import Validator from '../utils/validator';
import PreviewContext, { PreviewDispatch } from '../components/PreviewContext';
import DebTextField from '../components/DebTextField';
import { encodeBase64Url, decodeBase64Url } from '../utils/base64';

const validator = Validator();

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

type FragmentPagePropsData = {
  imageUrl?: string;
  title?: string;
  description?: string;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const data: FragmentPagePropsData = {
      imageUrl: decodeBase64Url((context.query?.imageUrl as string) || ''),
      title: decodeBase64Url((context.query?.title as string) || ''),
      description: decodeBase64Url((context.query?.description as string) || '')
    };
    return { props: { data: data } };
  } catch (err) {
    return { props: { errors: err.message } };
  }
};

const FragmentPage = ({
  data
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const previewStateContext = useContext(PreviewContext);
  const previewDispatch = useContext(PreviewDispatch);
  const [altText, setAltText] = useState('');
  const [linkText, setLinkText] = useState('');
  const [newTab, setNewTab] = useState(false);
  const [imgHtml, setImgHtml] = useState('');
  const [imgMarkdown, setImgMarkdown] = useState('');
  const htmlInputRef = useRef<HTMLTextAreaElement>();
  const markdownInputRef = useRef<HTMLTextAreaElement>();

  const [imageUrl, setImageUrl] = useState(
    data.imageUrl || previewStateContext.previewImageUrl // assets のチェックが入らない状態になる. あとで対応
  );
  const [imageUrlErrMsg, setImageUrlErrMsg] = useState('');
  const [title, setTitle] = useState(data.cardTitle || '');
  const [description, setDescription] = useState(data.cardDescription || '');
  const [cardPreviewUrl, setCardPreviewUrl] = useState('');

  const dataImageUrlErr = validator.assets(
    data.imageUrl,
    previewStateContext.validateAssets,
    previewStateContext.assets,
    true
  );

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

  const validateImageUrl = useCallback(() => {
    const err = validator.assets(
      imageUrl,
      previewStateContext.validateAssets,
      previewStateContext.assets,
      true
    );
    if (err && imageUrl !== '') {
      return err.message;
    }
    return '';
  }, [
    previewStateContext.validateAssets,
    previewStateContext.assets,
    imageUrl
  ]);

  useEffect(() => {
    setImageUrlErrMsg(validateImageUrl());
  }, [validateImageUrl, imageUrl]);

  useEffect(() => {
    if (imageUrl && validateImageUrl() === '') {
      const q = new URLSearchParams('');
      q.append('type', 'cardPreview');
      q.append('imageUrl', encodeBase64Url(imageUrl));
      q.append('title', encodeBase64Url(title));
      q.append('description', encodeBase64Url(description));
      // setCardPreviewUrl(`${window.location.href}?${q.toString()}`);
      setCardPreviewUrl(
        `${window.location.href.split('?', 1)[0]}?${q.toString()}`
      );
    } else {
      setCardPreviewUrl('');
    }
  }, [imageUrl, title, description, validateImageUrl]);

  useEffect(() => {
    if (validateImageUrl() === '') {
      previewDispatch({
        type: 'setPreviewImageUrl',
        payload: [imageUrl]
      });
    }
  }, [previewDispatch, imageUrl, validateImageUrl]);

  return (
    <Layout title="Fragment">
      <Head>
        <meta
          name="og:description"
          content={
            dataImageUrlErr === undefined
              ? data.description || '[preview] description'
              : dataImageUrlErr.message
          }
        />
        <meta
          property="og:image"
          content={dataImageUrlErr === undefined ? data.imageUrl : ''}
        />
        <meta name="og:title" content={data.title || '[preview] title'} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Container maxWidth="sm">
        <Box p={1}>
          <DebTextField
            error={imageUrlErrMsg ? true : false}
            id="preview-card-image-url"
            label="Preview Card Image URL"
            defaultValue={imageUrl}
            fullWidth
            helperText={imageUrlErrMsg}
            // 入力できないようにする?
            onChangeValue={({ value }) => {
              setImageUrl(value);
            }}
          />
        </Box>
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
        <Box>
          <Box>
            <Box p={1}>
              <DebTextField
                id="preview-card-title"
                label="Preview Card Title"
                defaultValue={data.cardTitle}
                fullWidth
                onChangeValue={({ value }) => {
                  setTitle(value);
                }}
              />
            </Box>
            <Box p={1}>
              <DebTextField
                id="preview-card-description"
                label="Preview Card Description"
                defaultValue={data.cardDescription}
                fullWidth
                onChangeValue={({ value }) => {
                  setDescription(value);
                }}
              />
            </Box>
          </Box>
          <Box p={1}>
            <TextField
              id="card-preview-url"
              label="Card Preview URL"
              //defaultValue={''}
              value={cardPreviewUrl}
              fullWidth
              //onChange={debounceBaseUrl()}
            />
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default FragmentPage;
