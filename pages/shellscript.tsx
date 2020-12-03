import React from 'react';
import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
// import PreviewContext from '../components/PreviewContext';
import FragmentDownload from '../components/FragmentDownload';
import FragmentMakeVariants from '../components/FragmentMakeVariants';

const ShellScriptPage = () => {
  // const classes = useStyles();
  //const router = useRouter();
  // const previewStateContext = useContext(PreviewContext);

  return (
    <Layout title="ShellScript">
      <Container maxWidth="md">
        <Box my={1} p={1}>
          <Typography variant="h5">{'Try it on Shell Script'}</Typography>
          <Box my={1} p={1}>
            <Typography variant="h6">
              Download images on the current workbench:
            </Typography>
            <Typography component={'span'} variant="body1">
              <ul>
                <li>open your favorite shell.</li>
                <li>run following "commands".</li>
              </ul>
            </Typography>
            <FragmentDownload />
          </Box>
          <Box my={1} p={1}>
            <Typography variant="h6">
              Make variant images by parameters:
            </Typography>
            <Typography component={'span'} variant="body1">
              <ul>
                <li>
                  save following "code" as shell script(ie. `make_variant.sh`).
                </li>
                <li>{`run saved script with <your image bare url>(ie. \`bash make_variant.sh 'https://..../foo.jpg'\`).`}</li>
              </ul>
            </Typography>
            <FragmentMakeVariants />
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default ShellScriptPage;
