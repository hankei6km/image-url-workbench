import React from 'react';
import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
// import PreviewContext, { PreviewDispatch } from '../components/PreviewContext';

const ShellScriptPage = () => {
  // const classes = useStyles();
  //const router = useRouter();
  // const previewStateContext = useContext(PreviewContext);
  // const previewDispatch = useContext(PreviewDispatch);

  return (
    <Layout title="Card">
      <Container maxWidth="md">
        <Box my={1} p={1}>
          <Typography variant="h5">{'Try it on Shell Script'}</Typography>
          <Box my={1} p={1}>
            <Typography variant="h6">Usage:</Typography>
            <Typography component={'span'} variant="body1">
              <ul>
                <li>open your favorite shell.</li>
                <li>run "commands".</li>
              </ul>
            </Typography>
          </Box>
          <Box my={1} p={1}>
            <Typography variant="h6">Usage:</Typography>
            <Typography component={'span'} variant="body1">
              <ul>
                <li>
                  save "script code" to file as shell script(ie.
                  `get_variant.sh`).
                </li>
                <li>{`run saved script with <your image bare url>(ie. \`sh get_variant.sh https://..../foo.jpg\`).`}</li>
              </ul>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default ShellScriptPage;
