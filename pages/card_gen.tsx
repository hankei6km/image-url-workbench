import React, { useEffect, useState } from 'react';
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

type CardGenPagePropsData = {
  imageUrl?: string;
  cardTitle?: string;
  cardDescription?: string;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const data: CardGenPagePropsData = {
      imageUrl: (context.query?.imageUrl as string) || '',
      cardTitle: (context.query?.cardTitle as string) || '',
      cardDescription: (context.query?.cardDescription as string) || ''
    };
    return { props: { ...data } };
  } catch (err) {
    return { props: { errors: err.message } };
  }
};

const CardGenPage = ({
  imageUrl,
  cardTitle,
  cardDescription
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  //const router = useRouter();
  const [previewImageUrl, setPreviewImageUrl] = useState(imageUrl);
  const [previewCardTitle, setPreviewCardTitle] = useState(cardTitle);
  const [previewCardDescription, setPreviewCardDescription] = useState(
    cardDescription
  );
  const [cardPreviewUrl, setCardPreviewUrl] = useState('');

  // console.log(router);
  // console.log(window.location);

  useEffect(() => {
    if (previewImageUrl) {
      const q = new URLSearchParams('');
      q.append('type', 'cardPreview');
      q.append('imageUrl', previewImageUrl);
      q.append('cardTitle', previewCardTitle);
      q.append('cardDescription', previewCardDescription);
      // setCardPreviewUrl(`${window.location.href}?${q.toString()}`);
      console.log(window.location);
      console.log(window.location.href.split('?', 1)[0]);
      console.log(q.toString());
      setCardPreviewUrl(
        `${window.location.href.split('?', 1)[0]}?${q.toString()}`
      );
    } else {
      setCardPreviewUrl('');
    }
  }, [previewImageUrl, previewCardTitle, previewCardDescription]);

  return (
    <Layout title="Card Gen">
      <Head>
        <meta name="og:description" content={cardDescription} />
        <meta property="og:image" content={imageUrl} />
        <meta name="og:title" content={cardTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Container maxWidth="sm">
        <Box pb={3}>
          <Box p={1}>
            <TextField
              id="preview-image-url"
              label="Preview Image URL"
              defaultValue={imageUrl}
              fullWidth
              onChange={(e) => {
                setPreviewImageUrl(e.target.value);
              }}
            />
          </Box>
          <Box p={1}>
            <TextField
              id="preview-card-title"
              label="Preview Card Title"
              defaultValue={cardTitle}
              fullWidth
              onChange={(e) => {
                setPreviewCardTitle(e.target.value);
              }}
            />
          </Box>
          <Box p={1}>
            <TextField
              id="preview-card-description"
              label="Preview Card Description"
              defaultValue={cardDescription}
              fullWidth
              onChange={(e) => {
                setPreviewCardDescription(e.target.value);
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
