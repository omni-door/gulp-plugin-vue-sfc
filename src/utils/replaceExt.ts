import * as path from 'path';

function replaceExt(filePath: string, ext: string) {
  if (typeof filePath !== 'string') {
    return filePath;
  }

  if (filePath.length === 0) {
    return filePath;
  }

  const fileName = path.basename(filePath, path.extname(filePath)) + ext;
  return path.join(path.dirname(filePath), fileName);
}

export default replaceExt;