import Link from 'next/link';
import Layout from '../components/Layout';
import Typography from '@material-ui/core/Typography';

const IndexPage = () => (
  <Layout title="Home | Next.js + TypeScript Example">
    <Typography variant="h4" component="h1" gutterBottom>
      Next.js + Typescript + Material UI
    </Typography>
    <p>
      <Link href="/about">
        <a>About</a>
      </Link>
    </p>
  </Layout>
);

export default IndexPage;
