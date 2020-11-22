import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
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
import Collapse from '@material-ui/core/Collapse';
import PreviewContext, {
  PreviewDispatch,
  PreviewItem
} from '../components/PreviewContext';
import ImportPanel from '../components/ImportPanel';
import TemplatePanel from '../components/TemplatePanel';
import ImgPreview from '../components/ImgPreview';
import { ImportTemplateParametersSet } from '../src/template';

const useStyles = makeStyles((theme) => ({
  targetIndicator: {
    backgroundColor: theme.palette.primary.main
  }
}));

function SetItem({
  editTargetKey,
  previewItem,
  onClick
}: {
  editTargetKey: string;
  previewItem: PreviewItem;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) {
  const previewDispatch = useContext(PreviewDispatch);
  const classes = useStyles();
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);

  return (
    <Box key={previewItem.previewUrl} my={1} p={1}>
      <Card>
        <CardHeader title={`${imgWidth}x${imgHeight}`} />
        <CardActionArea onClick={onClick}>
          <Box display="flex">
            <Box flexGrow="1">
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
                  if (previewItem.imgWidth === 0 && w !== 0) {
                    previewDispatch({
                      type: 'setPreviewImageSize',
                      payload: [previewItem.itemKey, w, h]
                    });
                    previewDispatch({
                      type: 'sortSet',
                      payload: []
                    });
                  }
                }}
              />
            </Box>
            <Box
              width={2}
              className={
                editTargetKey === previewItem.itemKey
                  ? classes.targetIndicator
                  : undefined
              }
            />
          </Box>
        </CardActionArea>
        <CardActions>
          <Button
            size="small"
            onClick={() => {
              previewDispatch({
                type: 'clonePreviewImageUrl',
                payload: [previewItem.itemKey]
              });
            }}
          >
            Clone
          </Button>
          <Button
            size="small"
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
  const router = useRouter();

  const [imageBaseUrl, setImageBaseUrl] = useState('');
  const [sampleImageBaseUrl, setSampleImageBaseUrl] = useState('');
  const [templateIdx, seTtemplateIdx] = useState(-1);
  const [parametersSet, setParametersSet] = useState<
    ImportTemplateParametersSet
  >([]);

  useEffect(() => {
    console.log(imageBaseUrl);
    if (imageBaseUrl) {
      previewDispatch({
        type: 'resetPreviewSet',
        payload: []
      });
      previewDispatch({
        type: 'importPreviewSet',
        payload: ['data', imageBaseUrl, parametersSet]
      });
    }
  }, [previewDispatch, imageBaseUrl, parametersSet]);

  useEffect(() => {
    if (
      (previewStateContext.previewSetKind === '' ||
        previewStateContext.previewSetKind === 'sample') &&
      sampleImageBaseUrl
    ) {
    }
  }, [
    previewStateContext.previewSetKind,
    previewDispatch,
    sampleImageBaseUrl,
    parametersSet
  ]);

  return (
    <Layout title="Set">
      <Container maxWidth="md">
        <Box>
          <ImportPanel
            onImport={({ value }) => {
              setImageBaseUrl(value);
            }}
          />
          <Collapse
            in={
              imageBaseUrl !== '' &&
              previewStateContext.previewSetState !== 'edited'
            }
          >
            <TemplatePanel
              disabled={previewStateContext.previewSetState === 'edited'}
              onSample={({ templateIdx: idx, imageBaseUrl, parametersSet }) => {
                if (templateIdx !== idx) {
                  seTtemplateIdx(idx);
                  setSampleImageBaseUrl(imageBaseUrl);
                  setParametersSet(parametersSet);
                }
              }}
            />
          </Collapse>
        </Box>
        <Box>
          {previewStateContext.previewSet.map((v) => (
            <SetItem
              key={v.itemKey}
              editTargetKey={previewStateContext.editTargetKey}
              previewItem={v}
              onClick={() => {
                previewDispatch({
                  type: 'setEditTarget',
                  payload: [v.itemKey]
                });
                router.push('/render');
              }}
            />
          ))}
        </Box>
      </Container>
    </Layout>
  );
};

export default SetPage;
