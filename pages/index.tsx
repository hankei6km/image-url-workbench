import React, { useCallback, useState } from 'react';
// import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
// import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
// import Collapse from '@material-ui/core/Collapse';
// import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import ImgUrl from '../components/ImgUrl';
import ImgPreview from '../components/ImgPreview';

// function HideOnScroll({ children }: { children: React.ReactElement }) {
//   const trigger = useScrollTrigger({
//     disableHysteresis: true,
//     threshold: 0
//   });
//
//   return <Collapse in={!trigger}>{children}</Collapse>;
// }

const IndexPage = () => {
  const theme = useTheme();
  // useMediaQuery 初期状態では false になる? PC での表示(lg)が初期状態になる方がフリッカーが抑えられる/
  // また、スマホ(Android の Chrome)でもちらつかない。
  // ただし、PC でも md のサイズでリロードするとちらつく。
  // TODO: makeStyle で CSS の機能で試す
  const mdDown = useMediaQuery(theme.breakpoints.down('md'));
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const [baseUrl, setBaseUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const debounceBaseUrl = useCallback(() => {
    // 汎用化できないか？
    let id: any = 0;
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (id !== 0) {
        clearTimeout(id);
      }
      id = setTimeout(
        (newValue) => {
          // set系をコールバックの中で呼んでも大丈夫?
          setBaseUrl(newValue);
          id = 0;
        },
        100,
        e.target.value
      );
    };
  }, []);
  const flexboxProps = mdDown
    ? {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column'
      }
    : {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row'
      };
  const appBarOuterProps = mdDown
    ? {}
    : {
        // flexGrow: 1,
        style: {
          maxWidth: theme.breakpoints.values.sm
        }
      };
  const imgPreviewOuterProps = mdDown
    ? {
        style: {
          width: '100%',
          minHeight: smDown ? 100 : 200
        }
      }
    : {
        style: {
          width: '100%',
          minHeight: 100
        }
      };
  const imgPreviewProps = mdDown
    ? {
        width: undefined,
        // 画像の縦横比によってははみ出る(ImgPreview側で調整)
        height: smDown ? 100 : 200,
        style: {
          width: '100%'
        }
      }
    : {
        width: theme.breakpoints.values.sm - 50,
        height: undefined,
        style: {
          width: '100%'
        }
      };
  const previewAppBar = (
    <AppBar
      color="inherit"
      position="sticky"
      elevation={0}
      {...appBarOuterProps}
    >
      <Toolbar style={{ width: '100%' }}>
        <Box
          display="flex"
          justifyContent="center"
          flexDirection="column"
          {...imgPreviewOuterProps}
        >
          <Box flexGrow={1}>
            <ImgPreview previewUrl={previewUrl} {...imgPreviewProps} />
          </Box>
          <Hidden mdDown>
            <Box>
              <TextField
                id="image-url"
                label="Image URL"
                defaultValue={''}
                fullWidth
                onChange={debounceBaseUrl()}
              />
            </Box>
            <Box p={1}>
              <Typography variant="body1">
                ここに簡易的な説明文を追加。テキスト等はmicroCMS で定義する?
                そのときは言語別に設定できるようにフィールド名を考える(他の方法でもいいけど)
              </Typography>
            </Box>
          </Hidden>
        </Box>
      </Toolbar>
    </AppBar>
  );
  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <Container maxWidth={mdDown ? 'sm' : undefined}>
        <Box {...flexboxProps}>
          {mdDown ? (
            previewAppBar
          ) : (
            <Box {...appBarOuterProps}>{previewAppBar}</Box>
          )}
          <Box
            mt={2}
            p={1}
            flexGrow={1}
            style={{ maxWidth: theme.breakpoints.values.sm }}
          >
            <Hidden lgUp>
              <Box>
                <TextField
                  id="image-url"
                  label="Image URL"
                  defaultValue={''}
                  fullWidth
                  onChange={debounceBaseUrl()}
                />
              </Box>
            </Hidden>
            <ImgUrl
              paramsItem={[
                {
                  paramsKey: 'blur'
                },
                {
                  paramsKey: 'mark'
                },
                {
                  paramsKey: 'mark-alpha'
                },
                {
                  paramsKey: 'blend'
                },
                {
                  paramsKey: 'txt'
                },
                {
                  paramsKey: 'txt-size'
                },
                {
                  paramsKey: 'txt-color'
                },
                {
                  paramsKey: 'txt-align'
                }
              ]}
              baseUrl={baseUrl}
              onChange={({ value }) => {
                // console.log(value);
                setPreviewUrl(value);
              }}
            />
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default IndexPage;
