import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { PreviewDispatch } from '../components/PreviewContext';
import ImportPanel from '../components/ImportPanel';
import SamplePanel from '../components/SamplePanel';

const IndexPage = () => {
  const previewDispatch = useContext(PreviewDispatch);
  const router = useRouter();

  return (
    <Layout title="Test Next.js Typescript Material UI">
      <Container maxWidth="md">
        <Box>
          <Box mt={1}>
            <ImportPanel
              label="Enter image url or select sample"
              onSelect={({ value }) => {
                previewDispatch({
                  type: 'setImageBaseUrl',
                  payload: ['data', value]
                });
                router.push('/overview');
              }}
            />
          </Box>
          <Box mt={1}>
            <SamplePanel
              onSelect={({ value }) => {
                previewDispatch({
                  type: 'setImageBaseUrl',
                  payload: ['sample', value]
                });
                router.push('/overview');
              }}
            />
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default IndexPage;
