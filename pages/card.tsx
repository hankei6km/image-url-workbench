import React, { useEffect, useState, useContext, useCallback } from 'react';
import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { encodeBase64Url } from '../utils/base64';
import Validator from '../utils/validator';
import PreviewContext, {
  PreviewDispatch,
  getTargetItemIndex
} from '../components/PreviewContext';
import DebTextField from '../components/DebTextField';
import FragmentTextField from '../components/FragmentTextField';

const validator = Validator();

const CardPage = () => {
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
  const [imageUrl, setImageUrl] = useState(
    getPreviewUrl() // assets のチェックが入らない状態になる. あとで対応
  );
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
  }, [validateImageUrl, imageUrl]);

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
      <Container maxWidth="sm">
        <Box pb={3}>
          <Box p={1}>
            <DebTextField
              error={imageUrlErrMsg ? true : false}
              id="preview-card-image-url"
              label="Preview Card Image URL"
              defaultValue={imageUrl}
              fullWidth
              helperText={imageUrlErrMsg}
              // 入力できないようにする?
              onChangeValue={({ value }) => {
                setImageUrl(value);
              }}
            />
          </Box>
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
        <Box p={1}>
          <FragmentTextField
            id="card-preview-url"
            label="Card Preview URL"
            value={cardPreviewUrl}
          />
        </Box>
      </Container>
    </Layout>
  );
};

export default CardPage;
