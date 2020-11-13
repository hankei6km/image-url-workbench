import React from 'react';
import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

const IndexPage = () => {
  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <Container>
        <Box>index</Box>
      </Container>
    </Layout>
  );
};

export default IndexPage;
