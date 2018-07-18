const path = require('path')
const Bundler = require('parcel-bundler')

const root = path.resolve(path.join(__dirname, '..'))

async function runBundle() {
  const hostBunlder = new Bundler(path.join(root, 'src/host/main.ts'), {
    watch: true,
    outFile: 'host',
    hmr: false
  })
  const browserBundler = new Bundler(path.join(root, 'src/browser/main.html'), {
    watch: true,
    outFile: 'browser',
    publicUrl: '.',
    hmr: true,
    hmrHostname: 'localhost',
  })

  hostBunlder.on('bundled', (bundle) => {
    browserBundler.onChange(path.join(root, 'src/browser/hmr.ts'))
  })

  await Promise.all([hostBunlder.bundle(), browserBundler.bundle()])
}

runBundle()
