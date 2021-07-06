import through2 from 'through2';
import PluginError from 'plugin-error';
import compiler from 'vue-template-compiler';
import replaceExt from '@utils/replaceExt';

const PLUGIN_NAME = 'gulp-plugin-vue-sfc';

export default function plugin(opts?: {
  compress?: boolean;
}) {
  return through2.obj((file, enc, next) => {
    if (file.extname !== '.vue') {
      // @ts-ignore
      this.emit('error', new PluginError(PLUGIN_NAME, 'Just support vue sfc file!'));
    } else if (!file.isNull()) {
      if (file.isStream()) {
        // @ts-ignore
        this.emit('error', new PluginError(PLUGIN_NAME, 'Stream not supported!'));
      }

      if (file.isBuffer()) {
        const content = file.contents.toString(enc);
        const template = compiler.compile(content, {
          whitespace: opts?.compress ? 'condense' : 'preserve'
        });

        if (template.errors?.length) {
          // @ts-ignore
          template.errors.forEach(err => this.emit('error', new PluginError(PLUGIN_NAME, err)));
        }

        file.contents = Buffer.from(template.render);
        file.path = replaceExt(file.path, '.js');
        // @ts-ignore
        this.push(file);
      }
    }

    return next(null, file);
  });
}
