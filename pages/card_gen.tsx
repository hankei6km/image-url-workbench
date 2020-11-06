import React, { useEffect, useState, useContext, useCallback } from 'react';
// import { GetStaticProps } from 'next';
import {
  //GetStaticProps,
  InferGetServerSidePropsType,
  GetServerSideProps
} from 'next';
import Head from 'next/head';
// import Link from 'next/link';
// import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { encodeBase64Url, decodeBase64Url } from '../utils/base64';
import Validator from '../utils/validator';
import PreviewContext, { PreviewDispatch } from '../components/PreviewContext';

const validator = Validator();

type CardGenPagePropsData = {
  imageUrl?: string;
  title?: string;
  description?: string;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const data: CardGenPagePropsData = {
      imageUrl: decodeBase64Url((context.query?.imageUrl as string) || ''),
      title: decodeBase64Url((context.query?.title as string) || ''),
      description: decodeBase64Url((context.query?.description as string) || '')
    };
    return { props: { data: data } };
  } catch (err) {
    return { props: { errors: err.message } };
  }
};

const CardGenPage = ({
  data
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  //const router = useRouter();
  const previewStateContext = useContext(PreviewContext);
  const previewDispatch = useContext(PreviewDispatch);
  const [imageUrl, setImageUrl] = useState(
    data.imageUrl || previewStateContext.previewImageUrl // assets のチェックが入らない状態になる. あとで対応
  );
  const [title, setTitle] = useState(data.cardTitle || '');
  const [description, setDescription] = useState(data.cardDescription || '');
  const [cardPreviewUrl, setCardPreviewUrl] = useState('');

  const [imageUrlErrMsg, setImageUrlErrMsg] = useState('');

  const dataImageUrlErr = validator.assets(
    data.imageUrl,
    previewStateContext.validateAssets,
    previewStateContext.assets,
    true
  );

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
    <Layout title="Card Gen">
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
        <Box pb={3}>
          <Box p={1}>
            <TextField
              error={imageUrlErrMsg ? true : false}
              id="preview-card-image-url"
              label="Preview Card Image URL"
              defaultValue={imageUrl}
              fullWidth
              helperText={imageUrlErrMsg}
              // 入力できないようにする?
              onChange={(e) => {
                setImageUrl(e.target.value);
              }}
            />
          </Box>
          <Box p={1}>
            <TextField
              id="preview-card-title"
              label="Preview Card Title"
              defaultValue={data.cardTitle}
              fullWidth
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </Box>
          <Box p={1}>
            <TextField
              id="preview-card-description"
              label="Preview Card Description"
              defaultValue={data.cardDescription}
              fullWidth
              onChange={(e) => {
                setDescription(e.target.value);
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
      </Container>
    </Layout>
  );
};
export default CardGenPage;
