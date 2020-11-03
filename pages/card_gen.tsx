import React, { useState } from 'react';
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
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const data: CardGenPagePropsData = {
      imageUrl: (context.query?.imageUrl as string) || ''
    };
    return { props: { ...data } };
  } catch (err) {
    return { props: { errors: err.message } };
  }
};

const CardGenPage = ({
  imageUrl
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  //const router = useRouter();
  const [cardPreviewUrl, setCardPreviewUrl] = useState(imageUrl);

  // console.log(router);
  // console.log(window.location);

  // useEffect(() => {
  //   setCardPreviewUrl(imageUrl);
  // }, [imageUrl]);

  return (
    <Layout title="Card Gen">
      <Head>
        <meta name="description" content="preview card description" />
        <meta property="og:image" content={imageUrl} />
        <meta name="og:title" content="card preview title" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Container maxWidth="sm">
        <Box p={1}>
          <TextField
            id="image-url"
            label="Image URL"
            defaultValue={''}
            fullWidth
            onChange={(e) => {
              const q = new URLSearchParams('');
              q.append('type', 'cardPreview');
              q.append('imageUrl', e.target.value);
              // setCardPreviewUrl(`${window.location.href}?${q.toString()}`);
              setCardPreviewUrl(`${window.location.href}?${q.toString()}`);
            }}
          />
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
