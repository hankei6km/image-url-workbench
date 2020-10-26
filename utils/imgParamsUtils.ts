import imgixUrlParams from 'imgix-url-params/dist/parameters.json';

type ParamsExpect = {
  [key: string]: any;
};
type Parameters = {
  [key: string]: { expects: ParamsExpect[] } & any;
};
const urlParams: {
  // とりあえず
  parameters: Parameters;
} = imgixUrlParams;

export function paramsKeyParameters(
  paramsKey: string
): typeof urlParams['parameters'] | undefined {
  return urlParams.parameters[paramsKey];
}

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

export function paramsKeyDisallowBase64(paramsKey: string): boolean {
  const p: any = urlParams.parameters[paramsKey];
  if (p) {
    return p.disallow_base64 === undefined ? false : p.disallow_base64;
  }
  return false;
}

export function expectToRange(
  exp: ParamsExpect
): [number, number | undefined] | undefined {
  if (exp.suggested_range) {
    const max =
      exp.suggested_range.max !== undefined ? exp.suggested_range.max : 500;
    return [exp.suggested_range.min, max];
  }
  return;
}

const colorTypes = ['hex_color', 'color_keyword'];
export function expectIsColor(exp: ParamsExpect): boolean {
  return colorTypes.includes(exp.type);
}

export function expectToList(exp: ParamsExpect): string[] | undefined {
  if (exp.type === 'list') {
    return exp.possible_values;
  }
  return;
}
