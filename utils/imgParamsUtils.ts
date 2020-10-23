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

export function paramsKeyToRange(
  paramsKey: string
): [number, number | undefined] | undefined {
  const p: any = urlParams.parameters[paramsKey] || {};
  if (p && p.expects && p.expects[0] && p.expects[0].suggested_range) {
    const max =
      p.expects[0].suggested_range.max !== undefined
        ? p.expects[0].suggested_range.max
        : 500;
    return [p.expects[0].suggested_range.min, max];
  }
  return;
}

const colorTypes = ['hex_color', 'color_keyword'];
export function paramsKeyIsColor(paramsKey: string): boolean {
  const p: any = urlParams.parameters[paramsKey] || {};
  if (p && p.expects && p.expects[0]) {
    return colorTypes.includes(p.expects[0].type);
  }
  return false;
}

export function paramsKeyToList(paramsKey: string): string[] | undefined {
  const p: any = urlParams.parameters[paramsKey] || {};
  if (p && p.expects && p.expects[0] && p.expects[0].type === 'list') {
    return p.expects[0].possible_values;
  }
  return;
}
