export function normalize(path: string) {
  return path.replace(/\\/g, '/');
}

export default normalize;