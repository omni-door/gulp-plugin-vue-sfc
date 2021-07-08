import path from 'path';
import through2 from 'through2';
import PluginError from 'plugin-error';
import { createDefaultCompiler, assemble } from '@vue/component-compiler';
import replaceExt from '@utils/replaceExt';
import normalize from '@utils/normalize';

import type { ScriptOptions, StyleOptions, TemplateOptions } from '@vue/component-compiler';

const applySourceMap = require('vinyl-sourcemaps-apply');
const PLUGIN_NAME = 'vue-sfc';

export default function plugin(opts?: {
  ext?: string;
  script?: ScriptOptions;
  style?: StyleOptions;
  template?: TemplateOptions;
  normalizer?: string;
  styleInjector?: string;
  styleInjectorSSR?: string;
}) {
  const { ext, script, style, template, normalizer, styleInjector, styleInjectorSSR } = opts || {};
  const vueCompiler = createDefaultCompiler({ script, style, template });

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
          const localPath = path.relative(file.cwd, file.path);
          const result = assemble(
            vueCompiler,
            localPath,
            vueCompiler.compileToDescriptor(localPath, content),
            { normalizer, styleInjector, styleInjectorSSR }
          );


          file.contents = Buffer.from(result.code);
          file.path = replaceExt(file.path, ext || '.js');

          if (file.sourceMap) {
            const { map } = result;
            if (!map.sourcesContent) map.sourcesContent = [content];
            map.sources = map.sources.map((f: string) =>
              normalize(path.relative(file.base, path.resolve(file.cwd, f)))
            );
            map.file = normalize(file.relative);
            applySourceMap(file, map);
          }
          this.push(file);
        } catch (err) {
          this.emit('error', new PluginError(PLUGIN_NAME, err));
        }
      }
    }

    return next(null, file);
  });
}
