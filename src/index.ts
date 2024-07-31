import path from 'path';
import * as crypto from 'crypto';
import through2 from 'through2';
import PluginError from 'plugin-error';
import { parse, compileScript, compileTemplate, compileStyle } from '@vue/compiler-sfc';
import replaceExt from '@utils/replaceExt';
import normalize from '@utils/normalize';

import type { SFCBlock, SFCScriptCompileOptions, SFCStyleCompileOptions, SFCTemplateCompileOptions } from '@vue/compiler-sfc';

const applySourceMap = require('vinyl-sourcemaps-apply');
const PLUGIN_NAME = 'vue-sfc';

type SFCMap = Exclude<SFCBlock['map'], undefined>;

export default function plugin(opts?: {
  ext?: string;
  script?: SFCScriptCompileOptions;
  style?: SFCStyleCompileOptions;
  template?: SFCTemplateCompileOptions;
}) {
  const { ext = '.js', script, style, template } = opts || {};

  return through2.obj(function (file, enc, next) {
    if (file.extname !== '.vue') {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Just support vue sfc file!'));
    } else if (!file.isNull()) {
      if (file.isStream()) {
        this.emit('error', new PluginError(PLUGIN_NAME, 'Stream not supported!'));
      }

      if (file.isBuffer()) {
        try {
          const content = file.contents.toString(enc);
          const { descriptor, errors } = parse(content, { filename: file.path });
          const id = crypto.createHash('md5').update(`${descriptor.filename}-${new Date().getTime()}-${Math.random()}`).digest('hex');
          if (errors.length) {
            errors.forEach(err => this.emit('error', new PluginError(PLUGIN_NAME, err)));
            return next();
          }

          let scriptResult = '', scriptMap: SFCMap | undefined;
          if (descriptor.script) {
            const { content, map } = compileScript(descriptor, { id, ...script });
            scriptResult = content;
            scriptMap = map;
          }

          let templateResult = '', templateMap: SFCMap | undefined;
          if (descriptor.template) {
            const { code, map } = compileTemplate({
              ...template!,
              id,
              source: descriptor.template.content,
              filename: file.path,
            });
            templateResult = code;
            templateMap = map;
          }

          let styleResult = '';
          const styleMap: SFCMap[] = [];
          if (descriptor.styles.length) {
            descriptor.styles.forEach(stylePart => {
              if (stylePart.content) {
                const { code, map } = compileStyle({
                  ...style!,
                  id,
                  source: stylePart.content,
                  filename: file.path,
                });
                styleResult += code;
                map && styleMap.push(map);
              }
            });
          }

          file.contents = Buffer.from(
            scriptResult + templateResult + styleResult
          );
          file.path = replaceExt(file.path, ext);

          if (file.sourceMap) {
            const map = {} as SFCMap;
            const mapArr = [] as SFCMap[];
            if (scriptMap) mapArr.push(scriptMap);

            if (templateMap) mapArr.push(templateMap);

            if (styleMap.length) mapArr.push(...styleMap);
            mapArr.map(m => {
              const { names, sources, sourcesContent, mappings, version } = m;
              map.sources = sources.map((f: string) =>
                normalize(path.relative(file.base, path.resolve(file.cwd, f)))
              );
              if (!map.sourcesContent) map.sourcesContent = [];
              sourcesContent && map.sourcesContent.push(...sourcesContent);
              map.file = normalize(file.relative);
              map.mappings += mappings;
              if (!map.version) map.version = version;
              if (!map.names) map.names = [];
              map.names.push(...names);
            });
            applySourceMap(file, map);
          }

          this.push(file);
        } catch (err: any) {
          this.emit('error', new PluginError(PLUGIN_NAME, err));
        }
      }
    }

    return next(null, file);
  });
}
