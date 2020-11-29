import React, { useEffect, useState, useContext, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { encodeBase64Url } from '../utils/base64';
import Validator from '../utils/validator';
import PreviewContext, {
  PreviewDispatch,
  getTargetItemIndex
} from '../components/PreviewContext';
import DebTextField from '../components/DebTextField';
import FragmentTextField from '../components/FragmentTextField';
import ImgPreview from '../components/ImgPreview';

const validator = Validator();

const useStyles = makeStyles((theme) => ({
  imagePreview: {
    width: 300,
    height: 150,
    [theme.breakpoints.up('sm')]: {
      width: 438,
      height: 220
    }
  }
}));

const CardPage = () => {
  const classes = useStyles();
  //const router = useRouter();
  const previewStateContext = useContext(PreviewContext);
  const previewDispatch = useContext(PreviewDispatch);
  const getPreviewUrl = useCallback(() => {
    const idx = getTargetItemIndex(
      previewStateContext.previewSet,
      previewStateContext.editTargetKey
    );
    return idx >= 0 ? previewStateContext.previewSet[idx].previewUrl : '';
  }, [previewStateContext.previewSet, previewStateContext.editTargetKey]);
  const [imageUrl] = useState(
    getPreviewUrl() // assets のチェックが入らない状態になる. あとで対応
  );
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const [title, setTitle] = useState(previewStateContext.card.title);
  const [description, setDescription] = useState(
    previewStateContext.card.description
  );
  const [cardPreviewUrl, setCardPreviewUrl] = useState('');

  const [imageUrlErrMsg, setImageUrlErrMsg] = useState('');

  const validateImageUrl = useCallback(() => {
    const err = validator.assets(
      imageUrl,
      previewStateContext.validateAssets,
      previewStateContext.assets,
      true
    );
    if (err && imageUrl !== '') {
      return err.message;
    }
    return '';
  }, [
    previewStateContext.validateAssets,
    previewStateContext.assets,
    imageUrl
  ]);

  useEffect(() => {
    setImageUrlErrMsg(validateImageUrl());
  }, [validateImageUrl]);

  useEffect(() => {
    if (imageUrl && validateImageUrl() === '') {
      const q = new URLSearchParams('');
      q.append('type', 'cardPreview');
      q.append('imageUrl', encodeBase64Url(imageUrl));
      q.append('title', encodeBase64Url(title));
      q.append('description', encodeBase64Url(description));
      // setCardPreviewUrl(`${window.location.href}?${q.toString()}`);
      setCardPreviewUrl(
        `${window.location.href.split('?', 1)[0]}_gen?${q.toString()}`
      );
    } else {
      setCardPreviewUrl('');
    }
  }, [imageUrl, title, description, validateImageUrl]);

  useEffect(() => {
    if (validateImageUrl() === '') {
      previewDispatch({
        type: 'setPreviewImageUrl',
        payload: [imageUrl]
      });
    }
  }, [previewDispatch, imageUrl, validateImageUrl]);

  useEffect(() => {
    previewDispatch({
      type: 'setCard',
      payload: [title, description]
    });
  }, [previewDispatch, title, description]);

  return (
    <Layout title="Card">
      <Container maxWidth="md">
        <Box my={1} p={1}>
          {imageUrlErrMsg === '' ? (
            <Box p={1}>
              <Box display="flex">
                <Box>
                  <Typography variant="body2">Preview Card Image</Typography>
                </Box>
                <Box ml={1}>
                  <Typography variant="body2">
                    {imgWidth > 0 ? `(${imgWidth} x ${imgHeight})` : ''}
                  </Typography>
                </Box>
              </Box>
              <Box className={classes.imagePreview}>
                <ImgPreview
                  previewUrl={imageUrl}
                  {...{
                    fitMode: 'landscape',
                    imgGrow: 'none',
                    width: undefined,
                    height: undefined
                  }}
                  skeleton={true}
                  onSize={({ w, h }) => {
                    setImgWidth(w);
                    setImgHeight(h);
                  }}
                />
              </Box>
            </Box>
          ) : (
            <Box p={1}>
              <DebTextField
                error={imageUrlErrMsg ? true : false}
                id="preview-card-image-url"
                label="Preview Card Image URL"
                defaultValue={imageUrl}
                fullWidth
                helperText={imageUrlErrMsg}
                value={imageUrl}
                onChangeValue={(_e) => {}}
              />
            </Box>
          )}
        </Box>
        <Box my={1} p={1}>
          <Typography variant="h6">Usage:</Typography>
          <Typography variant="body1">
            <ul>
              <li>copy "Card Preview URL" to clipboard</li>
              <li>
                open{' '}
                <a href="https://cards-dev.twitter.com/validator">
                  Twitter Card Validator
                </a>
              </li>
              <li>paste the url to "Card URL"</li>
            </ul>
          </Typography>
        </Box>
        <Box my={1} p={1}>
          <FragmentTextField
            id="card-preview-url"
            label="Card Preview URL"
            value={cardPreviewUrl}
          />
        </Box>
        <Box pb={3}>
          <Box p={1}>
            <DebTextField
              id="preview-card-title"
              label="Preview Card Title"
              // defaultValue={data.cardTitle}
              fullWidth
              value={title}
              onChangeValue={({ value }) => {
                setTitle(value);
              }}
            />
          </Box>
          <Box p={1}>
            <DebTextField
              id="preview-card-description"
              label="Preview Card Description"
              // defaultValue={data.cardDescription}
              fullWidth
              value={description}
              onChangeValue={({ value }) => {
                setDescription(value);
              }}
            />
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default CardPage;
