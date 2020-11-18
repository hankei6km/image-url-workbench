import React, { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
// import CardContent from '@material-ui/core/CardContent';
// import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import PreviewContext, { PreviewDispatch } from '../components/PreviewContext';
import ImgBaseUrl, { BaseUrlOnChangeEvent } from '../components/ImgBaseUrl';
import ImgPreview from '../components/ImgPreview';

const SetPage = () => {
  const previewStateContext = useContext(PreviewContext);
  const previewDispatch = useContext(PreviewDispatch);
  const router = useRouter();
  const [imageBaseUrl, setImageBaseUrl] = useState('');

  return (
    <Layout title="Set">
      <Container maxWidth="md">
        <Box display="flex">
          <Box flexGrow="1">
            <ImgBaseUrl
              baseUrl={imageBaseUrl}
              onChange={(e: BaseUrlOnChangeEvent) => {
                setImageBaseUrl(e.value);
              }}
            />
          </Box>
          <Button
            onClick={() => {
              previewDispatch({
                type: 'addPreviewImageUrl',
                payload: [imageBaseUrl]
              });
              setImageBaseUrl('');
            }}
          >
            Add
          </Button>
        </Box>
        <Box>
          {previewStateContext.previewSet.map((v) => {
            return (
              <Box key={v.previewUrl} my={1} p={1}>
                <Card>
                  <CardHeader title="1024x768" />
                  <CardActionArea>
                    <ImgPreview
                      previewUrl={v.previewUrl}
                      {...{
                        fitMode: 'landscape',
                        imgGrow: 'none',
                        width: undefined,
                        height: 400
                      }}
                    />
                  </CardActionArea>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => {
                        previewDispatch({
                          type: 'setEditTarget',
                          payload: [v.itemKey]
                        });
                        router.push('/render');
                      }}
                    >
                      Render
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => {
                        previewDispatch({
                          type: 'removeFromSet',
                          payload: [v.itemKey]
                        });
                      }}
                    >
                      Remove
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            );
          })}
        </Box>
      </Container>
    </Layout>
  );
};

export default SetPage;
