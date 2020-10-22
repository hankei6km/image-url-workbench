import imgixUrlParams from 'imgix-url-params/dist/parameters.json';

const urlParams: {
  // とりあえず
  parameters: { [key: string]: any };
} = imgixUrlParams;

export function paramsKeyToSpread(
  paramsKey: string
): { label: string; defaultValue: string | number } {
  const p: any = urlParams.parameters[paramsKey];
  if (p) {
    return {
      label: p.display_name,
      defaultValue: p.default
    };
  }
  return {
    label: '',
    defaultValue: ''
  };
}