import React, { useEffect, useState, useReducer } from 'react';
import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
// import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';

type paramsState = [string, string][];

const initialState: paramsState = [];
function reducer(
  state: paramsState,
  action: { type: string; payload: [string, string] }
): paramsState {
  switch (action.type) {
    case 'set':
      let replaced = false;
      const r: paramsState = state.map(([k, v]) => {
        if (k === action.payload[0]) {
          replaced = true;
          return [k, action.payload[1]];
        }
        return [k, v];
      });
      if (!replaced) {
        r.push(action.payload);
      }
      return r;
    default:
      throw new Error();
  }
}

const IndexPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [urlText, setUrlText] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  useEffect(() => {
    let done = false;
    let id = setTimeout(() => {
      // setImgStat(inputText === '' ? 'none' : 'loading');
      const q = new URLSearchParams('');
      state.forEach(([k, v]) => q.append(k, v));
      setImgUrl(`${urlText}?${q.toString()}`);
      done = true;
    }, 500);
    return () => {
      if (!done) {
        clearTimeout(id);
      }
    };
  }, [urlText, state]);

  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <Container maxWidth="sm">
        <Box p={1}>
          <Card style={{ height: 200 }}>
            <img height="200" src={imgUrl} alt="preview" />
          </Card>
          <TextField
            id="preview-url"
            label="Preview URL"
            fullWidth
            value={imgUrl}
          />
        </Box>
        <Box p={1}>
          <TextField
            id="image-url"
            label="Image URL"
            defaultValue={''}
            fullWidth
            onChange={(e) => {
              setUrlText(e.target.value);
            }}
          />
        </Box>
        <Box p={1}>
          <TextField
            id="txt"
            label="text"
            defaultValue={''}
            fullWidth
            onChange={(e) => {
              dispatch({ type: 'set', payload: ['txt', e.target.value] });
            }}
          />
        </Box>
      </Container>
    </Layout>
  );
};

export default IndexPage;
