import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PreviewContext, {
  PreviewDispatch,
  PreviewItem
} from '../components/PreviewContext';
import TemplatePanel from '../components/TemplatePanel';
import ImgPreview from '../components/ImgPreview';
import {
  BuiltinImportTemplate,
  ImportTemplateParametersSet
} from '../src/template';

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

const useActionBarStyles = makeStyles((theme) => ({
  bar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  indicatorOuter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '& .MuiButton-label > .MuiBox-root': {
      marginLeft: theme.spacing(1)
    }
  }
}));

function ActionBar({
  onTemplate
}: {
  onTemplate: ({
    templateIdx,
    sampleParametersSet,
    parametersSet
  }: {
    templateIdx: number;
    sampleParametersSet: ImportTemplateParametersSet;
    parametersSet: ImportTemplateParametersSet;
  }) => void;
}) {
  const classes = useActionBarStyles();
  const previewStateContext = useContext(PreviewContext);
  const [templateIdx, seTtemplateIdx] = useState(
    previewStateContext.templateIdx >= 0 ? previewStateContext.templateIdx : 0
  );
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <Box className={classes.bar}>
        <Box className={classes.indicatorOuter}>
          <Button
            endIcon={
              <ExpandMoreIcon
                style={{
                  transform: open ? 'rotate(180deg)' : '' /*'rotate(270deg)'*/
                }}
              />
            }
            onClick={() => setOpen(!open)}
            style={{ textTransform: 'none' }}
          >
            <Collapse in={!open}>
              <Box>
                <Typography variant="body1">
                  {BuiltinImportTemplate[templateIdx].label}
                </Typography>
              </Box>
            </Collapse>
            <Box>
              <Typography variant="body1">template</Typography>
            </Box>
          </Button>
        </Box>
      </Box>
      <Box>
        <TemplatePanel
          defaultIdx={previewStateContext.templateIdx}
          open={open}
          disabled={
            previewStateContext.previewSetState === 'edited' ||
            previewStateContext.imageBaseUrl === ''
          }
          onTemplate={({
            templateIdx: idx,
            sampleParametersSet,
            parametersSet
          }) => {
            seTtemplateIdx(idx);
            onTemplate({
              templateIdx: idx,
              sampleParametersSet: sampleParametersSet,
              parametersSet: parametersSet
            });
          }}
        />
      </Box>
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
    return () =>
      previewDispatch({
        type: 'setTemplateIdx',
        payload: [templateIdx]
      });
  }, [previewDispatch, templateIdx]);

  useEffect(() => {
    if (
      previewStateContext.imageBaseUrl !== '' &&
      previewStateContext.previewSetState !== 'edited'
    ) {
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
    previewStateContext.previewSetState,
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
        <Box py={1}></Box>
        <ActionBar
          onTemplate={({
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
                // https://github.com/vercel/next.js/issues/3249
                // browser によっては、Alt+left で戻るとスクロール位置がリセットされている:
                router.push('/render').then(() => window.scrollTo(0, 0));
              }}
            />
          ))}
        </Box>
      </Container>
    </Layout>
  );
};

export default PreviewsPage;
