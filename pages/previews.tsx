import React, { useCallback, useContext, useEffect, useState } from 'react';
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
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PreviewContext, {
  PreviewDispatch,
  PreviewItem,
  BreakPoint,
  BreakPointAutoAndValues
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

  const [mediaAnchorEl, setMediaAnchorEl] = useState<null | HTMLElement>(null);

  const handleClickMedia = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMediaAnchorEl(event.currentTarget);
  };

  const handleCloseMedia = () => {
    setMediaAnchorEl(null);
  };

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
          <Button size="small" onClick={handleClickMedia}>
            <Box display="flex" alignContent="center">
              <Box>Media: </Box>
              {previewItem.media}
            </Box>
          </Button>
          <Menu
            id="select-media"
            anchorEl={mediaAnchorEl}
            keepMounted
            open={Boolean(mediaAnchorEl)}
            onClose={handleCloseMedia}
          >
            {BreakPointAutoAndValues.map((v, i) => (
              <MenuItem
                key={i}
                onClick={() => {
                  handleCloseMedia();
                  previewDispatch({
                    type: 'setPreviewImageMedia',
                    payload: [previewItem.itemKey, v]
                  });
                }}
              >
                {v}
              </MenuItem>
            ))}
          </Menu>
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
    // justifyContent: 'center'
    justifyItems: 'center'
  },
  commandOuter: {
    flexGrow: 1,
    '& .MuiButton-root': {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'inline-flex'
      }
    },
    '& .MuiIconButton-root': {
      display: 'inline-flex',
      [theme.breakpoints.up('sm')]: {
        display: 'none'
      }
    }
  },
  indicatorOuter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    '& .MuiButton-label > .MuiBox-root': {
      marginLeft: theme.spacing(1)
    }
  },
  templateLabel: {
    display: 'flex',
    justifyContent: 'flex-end',
    //width: '6em'
    maxWidth: '10em'
  },
  templateButtonLabel: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  }
}));

function ActionBar({
  onTemplate
}: {
  onTemplate: ({
    templateIdx,
    sampleParametersSet,
    parametersSet,
    medias
  }: {
    templateIdx: number;
    sampleParametersSet: ImportTemplateParametersSet;
    parametersSet: ImportTemplateParametersSet;
    medias: BreakPoint[];
  }) => void;
}) {
  const classes = useActionBarStyles();
  const previewStateContext = useContext(PreviewContext);
  const [templateIdx, seTtemplateIdx] = useState(
    previewStateContext.templateIdx >= 0 ? previewStateContext.templateIdx : 0
  );
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = useState<'' | 'add' | 'template' | 'exiting'>('');
  const [nextOpen, setNextOpen] = useState<'' | 'add' | 'template'>('');

  const handleClickCommand = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleExited = useCallback(() => {
    setOpen('');
    if (nextOpen) {
      setOpen(nextOpen);
      setNextOpen('');
    }
  }, [nextOpen]);

  useEffect(() => {
    if (nextOpen) {
      switch (open) {
        case '':
          setOpen(nextOpen);
          setNextOpen('');
          break;
        case 'exiting':
          break;
        default:
          if (open === nextOpen) {
            setNextOpen('');
          }
          setOpen('exiting');
          break;
      }
    }
  }, [open, nextOpen]);

  return (
    <Box>
      <Box className={classes.bar}>
        <Box className={classes.commandOuter}>
          <IconButton size="small" onClick={handleClickCommand}>
            <MenuIcon />
          </IconButton>
          <Button
            variant="outlined"
            size="small"
            startIcon={<MenuIcon />}
            style={{ textTransform: 'none' }}
            onClick={handleClickCommand}
          >
            <Typography variant="body1">command</Typography>
          </Button>
          <Menu
            id="command-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem
              onClick={() => {
                handleCloseMenu();
                setNextOpen('add');
              }}
            >
              Add Image
            </MenuItem>
          </Menu>
        </Box>
        <Box className={classes.indicatorOuter}>
          <Button
            endIcon={
              <ExpandMoreIcon
                style={{
                  transform:
                    open === 'template'
                      ? 'rotate(180deg)'
                      : '' /*'rotate(270deg)'*/
                }}
              />
            }
            onClick={() => setNextOpen('template')}
            style={{ textTransform: 'none' }}
          >
            <Collapse in={open !== 'template'}>
              <Box className={classes.templateLabel}>
                <Typography variant="body1" noWrap>
                  {BuiltinImportTemplate[templateIdx].label}
                </Typography>
              </Box>
            </Collapse>
            <Box className={classes.templateButtonLabel}>
              <Typography variant="body1">template</Typography>
            </Box>
          </Button>
        </Box>
      </Box>
      <Box>
        <Collapse in={open === 'template'} onExited={handleExited}>
          <TemplatePanel
            defaultIdx={previewStateContext.templateIdx}
            disabled={
              previewStateContext.previewSetState === 'edited' ||
              previewStateContext.imageBaseUrl === ''
            }
            onTemplate={({
              templateIdx: idx,
              sampleParametersSet,
              parametersSet,
              medias
            }) => {
              seTtemplateIdx(idx);
              onTemplate({
                templateIdx: idx,
                sampleParametersSet: sampleParametersSet,
                parametersSet: parametersSet,
                medias: medias
              });
            }}
          />
        </Collapse>
      </Box>
      <Box>
        <Collapse in={open === 'add'} onExited={handleExited}>
          <Typography variant="body1">Add: not implement yet</Typography>
        </Collapse>
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
  const [medias, setMedias] = useState<BreakPoint[]>([]);

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
            payload: [
              'data',
              previewStateContext.imageBaseUrl,
              parametersSet,
              medias
            ]
          });
          break;
        case 'sample':
          previewDispatch({
            type: 'importPreviewSet',
            payload: [
              'sample',
              previewStateContext.imageBaseUrl,
              sampleParametersSet,
              medias
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
    sampleParametersSet,
    medias
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
            parametersSet,
            medias
          }) => {
            if (templateIdx !== idx) {
              seTtemplateIdx(idx);
              setSampleParametersSet(sampleParametersSet);
              setParametersSet(parametersSet);
              setMedias(medias);
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
