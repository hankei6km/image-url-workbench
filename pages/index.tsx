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
  const upLg = useMediaQuery(theme.breakpoints.up('lg'));
  const upMd = useMediaQuery(theme.breakpoints.up('md'));
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
  const flexboxProps = upLg
    ? {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row'
      }
    : {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column'
      };
  const appBarOuterProps = upLg
    ? {
        // flexGrow: 1,
        style: {
          maxWidth: theme.breakpoints.values.sm
        }
      }
    : {};
  const imgPreviewOuterProps = upLg
    ? {
        style: {
          width: '100%',
          minHeight: 100
        }
      }
    : {
        style: {
          width: '100%',
          minHeight: upMd ? 200 : 100
        }
      };
  const imgPreviewProps = upLg
    ? {
        width: theme.breakpoints.values.sm - 50,
        height: undefined,
        style: {
          width: '100%'
        }
      }
    : {
        width: undefined,
        // 画像の縦横比によってははみ出る(ImgPreview側で調整)
        height: upMd ? 200 : 100,
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
      <Container maxWidth={upLg ? undefined : 'sm'}>
        <Box {...flexboxProps}>
          {upLg ? (
            <Box {...appBarOuterProps}>{previewAppBar}</Box>
          ) : (
            previewAppBar
          )}
          <Box mt={2} p={1}>
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
