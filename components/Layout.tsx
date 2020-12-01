import React, { useState, useEffect, ReactNode } from 'react';
// import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from './Link';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import HomeIcon from '@material-ui/icons/Home';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > .MuiPapert-root > .MuiToolbar-root , & > footer > div': {
      maxWidth: '36rem',
      padding: '0 1rem',
      margin: '0rem auto 0rem'
    },
    '& > .stickyImageTabPanel': {
      [theme.breakpoints.up('sm')]: {
        position: 'sticky',
        top: -40,
        zIndex: theme.zIndex.appBar
      }
    },
    '& > .stickyPath': {
      [theme.breakpoints.up('sm')]: {
        position: 'sticky',
        top: 0,
        zIndex: theme.zIndex.appBar
      }
    },
    '& > .MuiPaper-root': {
      // padding: theme.spacing(1),
      position: 'static',
      width: '100%',
      '& > .MuiToolbar-root': {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        '& > .homeHeader': {
          justifyContent: 'center',
          '& .MuiBox-root': {
            width: '100%',
            maxWidth: theme.breakpoints.values.md,
            display: 'flex',
            alignItems: 'center',
            '% > .homeHeaderTitle': {
              flexGrow: 1
            }
          }
        },
        '& > .MuiBox-root': {
          maxWidth: theme.breakpoints.values.md,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          '& > .MuiBreadcrumbs-root': {
            flexGrow: 1
          }
        },
        '& > .AboutHeader': {
          justifyContent: 'center',
          '& > .MuiBox-root': {
            width: '100%',
            maxWidth: theme.breakpoints.values.sm,
            display: 'flex',
            alignItems: 'center'
          }
        },
        '& .HomePathIcon': {
          fontSize: theme.typography.fontSize * 1.0,
          [theme.breakpoints.up('sm')]: {
            fontSize: theme.typography.fontSize * 2.0
          }
        }
      },
      '& > .ImageTabPanel-root': {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'flex-end',
        alignItems: 'flex-end',
        width: '100%',
        [theme.breakpoints.up('lg')]: {
          minHeight: 40
        },
        '& > .MuiBox-root': {
          width: '100%',
          maxWidth: theme.breakpoints.values.md,
          '& > .MuiTabs-root': {
            minHeight: 10,
            '& > div': {
              minHeight: 10,
              '& .MuiTab-root': {
                minHeight: 10,
                padding: 0,
                textTransform: 'none',
                [theme.breakpoints.up('sm')]: {
                  paddingTop: theme.spacing(1),
                  paddingBottom: theme.spacing(2),
                  paddingLeft: theme.spacing(1),
                  paddingRight: theme.spacing(1),
                  minWidth: 100
                }
              }
            }
          }
        }
      }
    }
  }
}));

function HomeLabel({ asUrl }: { asUrl: string }): React.ReactElement {
  if (asUrl === '/') {
    return (
      <Box mt={1}>
        <Typography variant="inherit" color="inherit">
          {process.env.APP_NAME}
        </Typography>
      </Box>
    );
  } else if (asUrl === '/about') {
    return (
      <Box mt={1} display="flex">
        <Box mr={1}>
          <HomeIcon className="HomePathIcon" />
        </Box>
        <Typography variant="inherit" color="inherit">
          {process.env.APP_NAME}
        </Typography>
      </Box>
    );
  }
  return <HomeIcon className="HomePathIcon" />;
}

type BreadCrumbsItem = {
  label: React.ReactNode;
  href: string;
};

type BreadCrumbsPath = {
  path: BreadCrumbsItem[];
  current: BreadCrumbsItem;
};

const breadCrumbsPath: BreadCrumbsPath[] = [
  {
    path: [],
    current: {
      label: <HomeLabel asUrl="/" />,
      href: '/'
    }
  },
  {
    path: [{ label: <HomeLabel asUrl="/previews" />, href: '/' }],
    current: { label: 'result', href: '/previews' }
  },
  {
    path: [{ label: <HomeLabel asUrl="/parameters" />, href: '/' }],
    current: { label: 'result', href: '/parameters' }
  },
  {
    path: [{ label: <HomeLabel asUrl="/card" />, href: '/' }],
    current: { label: 'result', href: '/card' }
  },
  {
    path: [{ label: <HomeLabel asUrl="/codepen" />, href: '/' }],
    current: { label: 'result', href: '/codepen' }
  },
  {
    path: [
      { label: <HomeLabel asUrl="/render" />, href: '/' },
      { label: 'result', href: '/previews' }
    ],
    current: { label: 'render', href: '/render' }
  }
];

function getCurPath(asPath: string): BreadCrumbsPath {
  const p = asPath.split('?', 1)[0];
  const idx = breadCrumbsPath.findIndex((v) => v.current.href === p);
  if (idx >= 0) {
    return breadCrumbsPath[idx];
  }
  return breadCrumbsPath[0];
}

const tabLink = [
  { label: 'Previews', href: '/previews' },
  { label: 'Parameters', href: '/parameters' },
  { label: 'Card', href: '/card' },
  { label: 'CodePen', href: '/codepen' }
];

function getImageTabValue(asPath: string): number | boolean {
  const p = asPath.split('?', 1)[0];
  const idx = tabLink.findIndex(({ href }) => href === p);
  if (idx >= 0) {
    return idx;
  }
  return false;
}

function existImageTabPanel(asPath: string) {
  return (
    asPath === '/previews' ||
    asPath === '/parameters' ||
    asPath === '/card' ||
    asPath === '/codepen'
  );
}
function ImageTabPanel({ asPath }: { asPath: string }) {
  const [value] = useState<number | boolean>(getImageTabValue(asPath));

  if (existImageTabPanel(asPath)) {
    return (
      <Paper className="ImageTabPanel-root" square elevation={0}>
        <Box>
          <Tabs
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            value={value}
          >
            {tabLink.map((v, i) => (
              <Tab {...v} key={i} component={Link} naked />
            ))}
          </Tabs>
        </Box>
      </Paper>
    );
  }
  return <></>;
}

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = 'This is the default title' }: Props) => {
  const router = useRouter();
  const classes = useStyles();
  const [curPath, setCurPath] = useState<BreadCrumbsPath>(
    getCurPath(router.asPath)
  );

  useEffect(() => {
    setCurPath(getCurPath(router.asPath));
  }, [router.asPath]);

  return (
    <div className={classes.root}>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Paper
        square
        elevation={existImageTabPanel(router.asPath) ? 1 : 0}
        className={
          existImageTabPanel(router.asPath)
            ? 'stickyImageTabPanel'
            : 'stickyPath'
        }
      >
        <Toolbar variant="dense">
          {router.asPath === '/' ? (
            <Box className="homeHeader">
              <Box>
                <Box className="homeHeaderTitle">
                  <Link variant="h6" color="textPrimary" href="/">
                    <HomeLabel asUrl="/" />
                  </Link>
                </Box>
                <Link variant="button" color="textSecondary" href="/about">
                  About
                </Link>
              </Box>
            </Box>
          ) : router.asPath !== '/about' ? (
            <Box>
              <Breadcrumbs aria-label="breadcrumb">
                {curPath.path.map((v) => (
                  <Link
                    variant="body2"
                    color="textSecondary"
                    key={v.href}
                    href={v.href}
                  >
                    {v.label}
                  </Link>
                ))}
                <Typography variant="body2" color="textPrimary">
                  {curPath?.current?.label}
                </Typography>
              </Breadcrumbs>
            </Box>
          ) : (
            <Box className="AboutHeader">
              <Box>
                <Link variant="h6" color="textSecondary" href="/">
                  <HomeLabel asUrl="/about" />
                </Link>
              </Box>
            </Box>
          )}
        </Toolbar>
        <ImageTabPanel asPath={router.asPath} />
      </Paper>
      <div>{children}</div>
      <footer>
        <hr />
        <div>
          <span>I'm here to stay (Footer)</span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
