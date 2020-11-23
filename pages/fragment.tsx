import React from 'react';
import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import FragmentLink from '../components/FragmentLink';
import FragmentParams from '../components/FragmentParams';
import FragmentTag from '../components/FragmentTag';

export function FragmentPanel({
  groupName,
  children
}: {
  groupName: string;
  children: React.ReactNode;
}) {
  return (
    <Box my={1}>
      <Paper elevation={0}>
        <Box p={1}>
          <Typography variant="h6">{groupName}</Typography>
        </Box>
        <Box pl={1}>{children}</Box>
      </Paper>
    </Box>
  );
}

const FragmentPage = () => {
  return (
    <Layout title="Fragment">
      <Container maxWidth="sm">
        <Box py={1}>
          <FragmentPanel groupName="Parameters">
            <FragmentParams />
          </FragmentPanel>
          <FragmentPanel groupName="Link">
            <FragmentLink />
          </FragmentPanel>
          <FragmentPanel groupName="Tag">
            <FragmentTag />
          </FragmentPanel>
        </Box>
      </Container>
    </Layout>
  );
};

export default FragmentPage;
