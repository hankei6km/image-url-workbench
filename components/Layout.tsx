import React, { ReactNode } from 'react';
// import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from './Link';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > .MuiPapert-root > .MuiToolbar-root , & > footer > div': {
      maxWidth: '36rem',
      padding: '0 1rem',
      margin: '0rem auto 0rem'
    },
    '& > .MuiPaper-root': {
      position: 'static',
      flexGrow: 1,
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      [theme.breakpoints.up('lg')]: {
        position: 'sticky',
        top: 0,
        zIndex: theme.zIndex.appBar
      },
      '& .MuiTab-root': {
        textTransform: 'none',
        [theme.breakpoints.up('sm')]: {
          minWidth: 120
        }
      }
    }
  }
}));

const tabLink = [
  { label: 'Home', href: '/' },
  { label: 'Render', href: '/render' },
  { label: 'Fragment', href: '/fragment' },
  { label: 'Card', href: '/card' },
  { label: 'About', href: '/about' }
];

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = 'This is the default title' }: Props) => {
  const router = useRouter();
  const classes = useStyles();

  const tabValue = (asPath: string) => {
    const p = asPath.split('?', 1)[0];
    return tabLink.findIndex((v) => v.href === p);
  };

  return (
    <div className={classes.root}>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Paper square elevation={1}>
        <Tabs
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          value={tabValue(router.asPath)}
        >
          {tabLink.map((v, i) => (
            <Tab {...v} key={i} component={Link} naked />
          ))}
        </Tabs>
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
