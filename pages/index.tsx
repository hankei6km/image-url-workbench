import React, { useState, useCallback } from 'react';
import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import ImgUrl from '../components/ImgUrl';
import ImgPreview from '../components/ImgPreview';

const IndexPage = () => {
  const [baseUrl, setBaseUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const debounceBaseUrl = useCallback(() => {
    // 汎用化できないか？
    let id: any = 0;
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (id !== 0) {
        clearTimeout(id);
      }
      id = setTimeout(
        (newValue) => {
          // set系をコールバックの中で呼んでも大丈夫?
          setBaseUrl(newValue);
          id = 0;
        },
        100,
        e.target.value
      );
    };
  }, []);

  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <Container maxWidth="sm">
        <Box p={1}>
          <ImgPreview previewUrl={previewUrl} />
          <TextField
            id="preview-url"
            label="Preview URL"
            fullWidth
            value={previewUrl}
          />
        </Box>
        <Box p={1}>
          <TextField
            id="image-url"
            label="Image URL"
            defaultValue={''}
            fullWidth
            onChange={debounceBaseUrl()}
          />
        </Box>
        <ImgUrl
          paramsItem={[
            {
              paramsKey: 'blur'
            },
            {
              paramsKey: 'mark'
            },
            {
              paramsKey: 'mark-alpha'
            },
            {
              paramsKey: 'blend'
            },
            {
              paramsKey: 'txt'
            },
            {
              paramsKey: 'txt-size'
            },
            {
              paramsKey: 'txt-color'
            },
            {
              paramsKey: 'txt-align'
            }
          ]}
          baseUrl={baseUrl}
          onChange={({ value }) => {
            // console.log(value);
            setPreviewUrl(value);
          }}
        />
      </Container>
    </Layout>
  );
};

export default IndexPage;
