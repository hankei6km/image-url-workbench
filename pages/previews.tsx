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
import Button from '@material-ui/core/Button';
import Skeleton from '@material-ui/lab/Skeleton';
import PreviewContext, {
  PreviewDispatch,
  PreviewItem
} from '../components/PreviewContext';
import TemplatePanel from '../components/TemplatePanel';
import ImgPreview from '../components/ImgPreview';
import { ImportTemplateParametersSet } from '../src/template';

const useStyles = makeStyles((theme) => ({
  targetIndicator: {
    backgroundColor: theme.palette.primary.main
  }
}));

function SetItem({
  defaultTargetKey,
  previewItem,
  onClick
}: {
  defaultTargetKey: string;
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
        <CardHeader
          titleTypographyProps={{ variant: 'h5' }}
          title={
            imgWidth === 0 ? (
              <Skeleton variant="rect" width="10em" />
            ) : (
              `${imgWidth}x${imgHeight}`
            )
          }
        />
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
                skeleton={true}
                onSize={({ w, h }) => {
                  setImgWidth(w);
                  setImgHeight(h);
                  if (previewItem.imgWidth === 0 && w !== 0) {
                    previewDispatch({
                      type: 'setPreviewImageSize',
                      payload: [previewItem.itemKey, w, h]
                    });
                  }
                }}
              />
            </Box>
            <Box
              width={2}
              className={
                defaultTargetKey === previewItem.itemKey
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
                type: 'setDefaultTarget',
                payload: [previewItem.itemKey]
              });
            }}
          >
            Default
          </Button>
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

const PreviewsPage = () => {
  const previewStateContext = useContext(PreviewContext);
  const previewDispatch = useContext(PreviewDispatch);
  const router = useRouter();

  const [templateIdx, seTtemplateIdx] = useState(-1);
  const [sampleParametersSet, setSampleParametersSet] = useState<
    ImportTemplateParametersSet
  >([]);
  const [parametersSet, setParametersSet] = useState<
    ImportTemplateParametersSet
  >([]);

  useEffect(() => {
    if (previewStateContext.imageBaseUrl !== '') {
      previewDispatch({
        type: 'resetPreviewSet',
        payload: []
      });
      switch (previewStateContext.previewSetKind) {
        case 'data':
          previewDispatch({
            type: 'importPreviewSet',
            payload: ['data', previewStateContext.imageBaseUrl, parametersSet]
          });
          break;
        case 'sample':
          previewDispatch({
            type: 'importPreviewSet',
            payload: [
              'sample',
              previewStateContext.imageBaseUrl,
              sampleParametersSet
            ]
          });
          break;
      }
    }
  }, [
    previewDispatch,
    previewStateContext.imageBaseUrl,
    previewStateContext.previewSetKind,
    parametersSet,
    sampleParametersSet
  ]);

  // useEffect(() => {
  //   if (sampleImageBaseUrl !== '') {
  //     previewDispatch({
  //       type: 'resetPreviewSet',
  //       payload: []
  //     });
  //     previewDispatch({
  //       type: 'importPreviewSet',
  //       payload: ['sample', sampleImageBaseUrl, sampleParametersSet]
  //     });
  //   }
  // }, [previewDispatch, sampleImageBaseUrl, sampleParametersSet]);

  useEffect(() => {
    if (
      previewStateContext.previewSet.every(
        ({ imgWidth, imgHeight }) => imgWidth > 0 && imgHeight > 0
      )
    ) {
      previewDispatch({
        type: 'sortSet',
        payload: []
      });
    }
  }, [previewDispatch, previewStateContext.previewSet]);

  return (
    <Layout title="Previews">
      <Container maxWidth="md">
        <Box py={1}>
          <TemplatePanel
            disabled={
              previewStateContext.previewSetState === 'edited' ||
              previewStateContext.imageBaseUrl === ''
            }
            onSample={({
              templateIdx: idx,
              sampleParametersSet,
              parametersSet
            }) => {
              if (templateIdx !== idx) {
                seTtemplateIdx(idx);
                setSampleParametersSet(sampleParametersSet);
                setParametersSet(parametersSet);
              }
            }}
          />
        </Box>
        <Box>
          {previewStateContext.previewSet.map((v) => (
            <SetItem
              key={v.itemKey}
              defaultTargetKey={previewStateContext.defaultTargetKey}
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

export default PreviewsPage;