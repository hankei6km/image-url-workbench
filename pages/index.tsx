import React, { useEffect, useState, useContext } from 'react';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
// import Collapse from '@material-ui/core/Collapse';
import Fade from '@material-ui/core/Fade';
// import Slide from '@material-ui/core/Slide';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
// import Hidden from '@material-ui/core/Hidden';
import SearchIcon from '@material-ui/icons/Search';
import PreviewContext, { PreviewDispatch } from '../components/PreviewContext';
import {
  ImgParamsItems,
  flattenParams,
  imgParasmItemInclude
} from '../utils/imgParamsUtils';
import DebTextField from '../components/DebTextField';
import ImgBaseUrl, { BaseUrlOnChangeEvent } from '../components/ImgBaseUrl';
import ImgUrl from '../components/ImgUrl';
import ImgPreview from '../components/ImgPreview';

// function HideOnScroll({ children }: { children: React.ReactElement }) {
//   const trigger = usescrolltrigger({
//     disablehysteresis: true,
//     threshold: 0
//   });
//
//   return <Collapse in={!trigger}>{children}</Collapse>;
// }

// クライアント側で毎回リスト作るのも効率悪くない?
// props 経由で渡すのは?
// どこまでサーバー側でやるのがよい?
const imgUrlParams = flattenParams();

const useStyles = makeStyles((theme) => ({
  container: {
    // chrome mobile で横スクロールが発生する状態で
    // position="fixed" で固定した領域が横幅が広がる、アドレスバーの裏に隠れるなどが発生する。
    // "auto" にすると回避できるが、これが良いのかは不明。
    // desktop の chrome で横スクロールバーが表示されるような記述があるが、
    // 試したかぎりでは出てこない。
    overflow: 'auto',
    // chrome mobile で
    [theme.breakpoints.down('md')]: {
      maxWidth: theme.breakpoints.values.sm
    }
  },
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    [theme.breakpoints.up('lg')]: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'row'
    }
  },
  imagePanel: {
    [theme.breakpoints.up('lg')]: {
      maxWidth: theme.breakpoints.values.sm
    }
  },
  imgPreviewOuter: {
    width: '100%',
    minHeight: 200,
    [theme.breakpoints.up('lg')]: {
      minHeight: 100,
      width: theme.breakpoints.values.sm
    }
  },
  imgPreviewFixLgUp: {
    [theme.breakpoints.up('lg')]: {
      position: 'fixed',
      top: 70,
      maxWidth: theme.breakpoints.values.sm
    }
  },
  imageUrlOuterLgUp: {
    display: 'none',
    [theme.breakpoints.up('lg')]: {
      display: 'block'
    }
  }
}));

const IndexPage = () => {
  const theme = useTheme();
  const previewStateContext = useContext(PreviewContext);
  const previewDispatch = useContext(PreviewDispatch);
  const classes = useStyles();

  // useMediaQuery 初期状態では false になる? PC での表示(lg)が初期状態になる方がフリッカーが抑えられる/
  // また、スマホ(Android の Chrome)でもちらつかない。
  // ただし、PC でも md のサイズでリロードするとちらつく。
  // TODO: makeStyle で CSS の機能で試す
  const mdDown = useMediaQuery(theme.breakpoints.down('md'));
  const [imageRawUrl, setImageRawUrl] = useState(
    previewStateContext.previewImageUrl
  );
  const [imageBaseUrl, setImageBaseUrl] = useState(
    previewStateContext.previewImageUrl
  );
  const [previewUrl, setPreviewUrl] = useState(
    previewStateContext.previewImageUrl
  );

  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    previewDispatch({
      type: 'setPreviewImageUrl',
      payload: [previewUrl]
    });
  }, [previewDispatch, previewUrl]);

  const debounceImageRawUrl = () => {
    // 汎用化できないか？
    let id: any = 0;
    return (e: BaseUrlOnChangeEvent) => {
      if (id !== 0) {
        clearTimeout(id);
      }
      id = setTimeout(
        (newValue) => {
          // set系をコールバックの中で呼んでも大丈夫?
          setImageRawUrl(newValue);
          id = 0;
        },
        100,
        e.value
      );
    };
  };

  const imgPreviewProps = mdDown
    ? {
        width: undefined,
        // 画像の縦横比によってははみ出る(ImgPreview側で調整)
        height: 200
      }
    : {
        width: theme.breakpoints.values.sm - 50,
        height: undefined
      };
  const imgPreviewThumbProps = {
    position: 'fixed',
    top: 0,
    width: undefined,
    // 画像の縦横比によってははみ出る(ImgPreview側で調整)
    height: 100
  };

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 250
  });

  const [filteredImgParams, setFilteredImgParams] = useState<ImgParamsItems>(
    []
  );
  useEffect(() => {
    setFilteredImgParams(
      searchText
        ? imgUrlParams.filter((v) => imgParasmItemInclude(v, searchText))
        : imgUrlParams
    );
  }, [searchText]);

  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <Box
        position="fixed"
        top={0}
        // left={0}
        // right={0}
        style={{
          width: '100%', // dialog が表示されてスクロールバーが消えると右へズレる
          // height: trigger ? 200 : 0,
          // maxHeight: 10,
          zIndex: theme.zIndex.appBar
        }}
      >
        <Fade in={mdDown && trigger} timeout={{ enter: 700 }}>
          <Paper
            square
            style={{
              position: 'fixed',
              top: 0,
              width: '100%',
              height: 100,
              padding: mdDown && trigger ? theme.spacing(1) : 0
            }}
          >
            {mdDown && trigger && (
              <ImgPreview previewUrl={previewUrl} {...imgPreviewThumbProps} />
            )}
          </Paper>
        </Fade>
      </Box>
      <Container className={classes.container}>
        <Box className={classes.root}>
          <Box className={classes.imagePanel}>
            <Box
              display="flex"
              justifyContent="center"
              flexDirection="column"
              className={classes.imgPreviewOuter}
            >
              <Box className={classes.imgPreviewFixLgUp}>
                <Box>
                  <ImgBaseUrl
                    baseUrl={imageBaseUrl}
                    onChange={debounceImageRawUrl()}
                  />
                </Box>
                <Box mt={2} className={classes.imageUrlOuterLgUp}>
                  <Typography variant="body1">
                    ここに簡易的な説明文を追加。テキスト等はmicroCMS で定義する?
                    そのときは言語別に設定できるようにフィールド名を考える(他の方法でもいいけど)
                  </Typography>
                </Box>
                <Box mt={3}>
                  <Fade in={!(mdDown && trigger)} timeout={{ enter: 700 }}>
                    <Paper
                      square
                      elevation={0}
                      style={{ minHeight: 220, width: '100%' }}
                    >
                      <ImgPreview
                        position={mdDown && trigger ? 'fixed' : 'static'}
                        previewUrl={previewUrl}
                        {...imgPreviewProps}
                      />
                    </Paper>
                  </Fade>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            mt={2}
            p={1}
            flexGrow={1}
            style={{ maxWidth: theme.breakpoints.values.sm }}
          >
            <Box mb={1}>
              <DebTextField
                placeholder="search"
                fullWidth
                value={searchText}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
                onChangeValue={({ value }) => setSearchText(value)}
              />
            </Box>
            <Box>
              <ImgUrl
                paramsItem={filteredImgParams}
                categorize={searchText ? false : true}
                imageRawUrl={imageRawUrl}
                onChangeImageUrl={({ value }) => {
                  // console.log(value);
                  setImageBaseUrl(value);
                }}
                onChangePreviewUrl={({ value }) => {
                  // console.log(value);
                  setPreviewUrl(value);
                }}
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default IndexPage;
