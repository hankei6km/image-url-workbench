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
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import PreviewContext, {
  PreviewDispatch,
  PreviewItem
} from '../components/PreviewContext';
import ImgBaseUrl, {
  BaseUrlOnChangeEvent,
  BaseUrlOnEnterKeyEvent
} from '../components/ImgBaseUrl';
import ImgPreview from '../components/ImgPreview';

function SetItem({ previewItem }: { previewItem: PreviewItem }) {
  const previewDispatch = useContext(PreviewDispatch);
  const router = useRouter();
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);

  return (
    <Box key={previewItem.previewUrl} my={1} p={1}>
      <Card>
        <CardHeader title={`${imgWidth}x${imgHeight}`} />
        <CardActionArea>
          <ImgPreview
            previewUrl={previewItem.previewUrl}
            {...{
              fitMode: 'landscape',
              imgGrow: 'none',
              width: undefined,
              height: 400
            }}
            onSize={({ w, h }) => {
              setImgWidth(w);
              setImgHeight(h);
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
                payload: [previewItem.itemKey]
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
                payload: [previewItem.itemKey]
              });
            }}
          >
            Remove
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}

const SetPage = () => {
  const previewStateContext = useContext(PreviewContext);
  const previewDispatch = useContext(PreviewDispatch);
  const [imageBaseUrl, setImageBaseUrl] = useState('');

  return (
    <Layout title="Set">
      <Container maxWidth="md">
        <Box display="flex" alignItems="flex-end" my={1}>
          <Box flexGrow="1">
            <ImgBaseUrl
              baseUrl={imageBaseUrl}
              onEnterKey={(e: BaseUrlOnEnterKeyEvent) => {
                previewDispatch({
                  type: 'addPreviewImageUrl',
                  payload: [e.value]
                });
                setImageBaseUrl('');
              }}
              onChange={(e: BaseUrlOnChangeEvent) => {
                setImageBaseUrl(e.value);
              }}
            />
          </Box>
          <Box p={1}>
            <Button
              color="primary"
              variant="contained"
              size="small"
              startIcon={<AddPhotoAlternateIcon fontSize="small" />}
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
        </Box>
        <Box>
          {previewStateContext.previewSet.map((v) => (
            <SetItem previewItem={v} />
          ))}
        </Box>
      </Container>
    </Layout>
  );
};

export default SetPage;
