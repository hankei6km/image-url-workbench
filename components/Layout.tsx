import React, { useState, useEffect, ReactNode } from 'react';
// import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from './Link';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
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
    '& > .MuiPaper-root': {
      padding: theme.spacing(1),
      position: 'static',
      flexGrow: 1,
      width: '100%',
      display: 'flex',
      //maxWidth: theme.breakpoints.values.sm,
      justifyContent: 'center',
      [theme.breakpoints.up('lg')]: {
        position: 'sticky',
        top: 0,
        zIndex: theme.zIndex.appBar
      },
      '& > .MuiToolbar-root': {
        width: '100%',
        maxWidth: theme.breakpoints.values.md,
        '& > .MuiBox-root': {
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
          fontSize: theme.typography.fontSize * 1.5,
          [theme.breakpoints.up('sm')]: {
            fontSize: theme.typography.fontSize * 2.5
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
    path: [{ label: <HomeLabel asUrl="/set" />, href: '/' }],
    current: { label: 'previews', href: '/set' }
  },
  {
    path: [
      { label: <HomeLabel asUrl="/render" />, href: '/' },
      { label: 'previews', href: '/set' }
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
      <Paper square elevation={0}>
        <Toolbar>
          {router.asPath !== '/about' ? (
            <Box>
              <Breadcrumbs aria-label="breadcrumb">
                {curPath.path.map((v) => (
                  <Link
                    variant="h6"
                    color="textSecondary"
                    key={v.href}
                    href={v.href}
                  >
                    {v.label}
                  </Link>
                ))}
                <Typography variant="h6" color="textPrimary">
                  {curPath?.current?.label}
                </Typography>
              </Breadcrumbs>
              <Link variant="body1" color="textSecondary" href="/about">
                About
              </Link>
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
