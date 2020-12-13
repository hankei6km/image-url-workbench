import React, { useState, useContext, useEffect } from 'react';
import ReactDomServer from 'react-dom/server';
import Box from '@material-ui/core/Box';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import unified from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import format from 'rehype-format';
import rehypeSanitize from 'rehype-sanitize';
import PreviewContext, {
  getTargetItemIndex,
  breakPointValue
} from '../components/PreviewContext';
import FragmentCodePanel from '../components/FragmentCodePannel';
import { ImgParamsValues } from '../utils/imgParamsUtils';
import merge from 'deepmerge';
import gh from 'hast-util-sanitize/lib/github.json';
import { Schema } from 'hast-util-sanitize';
import CodePenDefineForm from '../components/CodePen';
import TryItOn from '../components/TryItOn';

const schema = merge(gh, {
  tagNames: ['picture', 'source'],
  attributes: { source: ['srcSet', 'sizes'], img: ['srcSet', 'sizes'] }
});
const processorHtml = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeSanitize, (schema as unknown) as Schema)
  .use(format)
  .use(rehypeStringify)
  .freeze();

const FragmentMakeTestbedPitureTag = () => {
  const previewStateContext = useContext(PreviewContext);

  const [defaultItem, setDefaultItem] = useState<{
    itemKey: string;
    previewUrl: string;
    imageParams: ImgParamsValues;
  }>({
    itemKey: '',
    previewUrl: '',
    imageParams: []
  });

  const [pictureHtml, setPictureHtml] = useState('');

  useEffect(() => {
    const idx = getTargetItemIndex(
      previewStateContext.previewSet,
      previewStateContext.defaultTargetKey
    );
    if (idx >= 0) {
      setDefaultItem({
        itemKey: previewStateContext.defaultTargetKey,
        previewUrl: previewStateContext.previewSet[idx].previewUrl,
        imageParams: previewStateContext.previewSet[idx].imageParams
      });
    }
  }, [previewStateContext.previewSet, previewStateContext.defaultTargetKey]);

  useEffect(() => {
    const pictureElement = (
      <div>
        <div>
          <p id="drp" />
        </div>
        <picture>
          {previewStateContext.previewSet
            .filter(({ itemKey }) => itemKey !== defaultItem.itemKey)
            .map(({ previewUrl, imgWidth, media }, i) => {
              const mw = breakPointValue(media, imgWidth);
              return (
                <source
                  key={i}
                  // src={`${previewUrl}`}
                  srcSet={`${previewUrl} ${imgWidth}w`}
                  sizes={`(min-width: ${mw}px) ${imgWidth}px`}
                  media={`(min-width: ${mw}px)`}
                />
              );
            })}
          <img src={defaultItem.previewUrl} alt="preview in playground" />
        </picture>
      </div>
    );
    const html = ReactDomServer.renderToStaticMarkup(pictureElement);
    processorHtml.process(html, (err, file) => {
      if (err) {
        console.error(err);
      }
      setPictureHtml(
        `<form>
  Enter another image url: <input id="imgurl" />
  <button type="submit" id="run">run</button>
</form>` + String(file)
      );
    });
  }, [previewStateContext.previewSet, defaultItem]);

  return (
    <Box mx={1}>
      <Box p={1}>
        <TryItOn
          title="CodePen"
          linkButtons={[
            <CodePenDefineForm
              title="testbed (picture tag)"
              html={pictureHtml}
              js={`
              document.querySelector("#user-content-drp").innerText=\`device pixel ratio=\${window.devicePixelRatio}\`
              const imgurl = document.querySelector("#imgurl");
              const sources = document.querySelectorAll("source");
              const sourcesParams = [];
              sources.forEach((v) => {
                sourcesParams.push(v.srcset.split(" ", 1)[0].split("?", 2)[1]);
              });
              const img = document.querySelector("img");
              const imgParams = img.src.split("?", 2)[1];
              const run = (e) => {
                const u = imgurl.value.split("?", 1)[0];
                sources.forEach((e, i) => {
                  e.srcset = \`\${u}?\${sourcesParams[i]}\`;
                });
                img.src = \`\${u}?\${imgParams}\`;
                e.preventDefault();
              };
              document.querySelector("form").onsubmit = run;`}
              buttonLabel={'make'}
              buttonProps={{
                color: 'primary',
                variant: 'contained',
                disableElevation: true,
                endIcon: <OpenInNewIcon />
              }}
            />
          ]}
        />
      </Box>
      <Box>
        <Box p={1}>
          <FragmentCodePanel
            naked
            label="picture tag"
            value={pictureHtml}
            language="html"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default FragmentMakeTestbedPitureTag;
