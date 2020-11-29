import React, { useEffect, useState, useContext, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CheckIcon from '@material-ui/icons/Check';
import { encodeBase64Url } from '../utils/base64';
import Validator from '../utils/validator';
import PreviewContext, {
  CardType,
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

const cardTypeList: { label: string; cardType: CardType }[] = [
  { label: 'summary', cardType: 'summary' },
  { label: 'summary large image', cardType: 'summary_large_image' }
];

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
  const [cardType, setCardType] = useState(previewStateContext.card.cardType);
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

  const handleListItemClick = (cardType: CardType) => {
    setCardType(cardType);
  };

  useEffect(() => {
    setImageUrlErrMsg(validateImageUrl());
  }, [validateImageUrl]);

  useEffect(() => {
    if (imageUrl && validateImageUrl() === '') {
      const q = new URLSearchParams('');
      q.append('cardType', encodeBase64Url(cardType));
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
  }, [imageUrl, cardType, title, description, validateImageUrl]);

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
      payload: [cardType, title, description]
    });
  }, [previewDispatch, cardType, title, description]);

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
          <Box>
            <Accordion
              elevation={0}
              // expanded={groupName === opened}
              // onChange={onChange}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`optional parameters panel`}
                IconButtonProps={{ edge: 'start' }}
              >
                <Typography variant="body2">Optional fields</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box width="100%">
                  <Typography variant="body1" color="textSecondary">
                    Preview Card Type
                  </Typography>
                  <Box p={1}>
                    <List component="nav" aria-label="main mailbox folders">
                      {cardTypeList.map((v) => (
                        <ListItem
                          key={v.cardType}
                          button
                          onClick={() => handleListItemClick(v.cardType)}
                        >
                          <ListItemIcon>
                            {cardType === v.cardType && <CheckIcon />}
                          </ListItemIcon>
                          <ListItemText primary={v.label} />
                        </ListItem>
                      ))}
                    </List>
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
              </AccordionDetails>
            </Accordion>
          </Box>
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
      </Container>
    </Layout>
  );
};

export default CardPage;
