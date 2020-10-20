import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
// import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';

const IndexPage = () => {
  const [urlText, setUrlText] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  useEffect(() => {
    let done = false;
    let id = setTimeout(() => {
      // setImgStat(inputText === '' ? 'none' : 'loading');
      setImgUrl(urlText);
      done = true;
    }, 500);
    return () => {
      if (!done) {
        clearTimeout(id);
      }
    };
  }, [urlText]);

  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <Container maxWidth="sm">
        <Box p={1}>
          <Card style={{ height: 200 }}>
            <img height="200" src={imgUrl} alt="preview" />
          </Card>
          <TextField
            id="preview-url"
            label="Preview URL"
            fullWidth
            readOnly
            value={urlText}
          />
        </Box>
        <Box p={1}>
          <TextField
            id="image-url"
            label="Image URL"
            defaultValue={''}
            fullWidth
            onChange={(e) => {
              setUrlText(e.target.value);
            }}
          />
        </Box>
      </Container>
    </Layout>
  );
};

export default IndexPage;
