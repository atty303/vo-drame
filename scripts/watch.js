const path = require('path')
const Bundler = require('parcel-bundler')

const root = path.resolve(path.join(__dirname, '..'))

async function runBundle() {
  const hostBundler = new Bundler(path.join(root, 'src/host/main.ts'), {
    watch: true,
    outFile: 'host',
    hmr: false
  })
  const browserBundler = new Bundler(path.join(root, 'src/browser/main.html'), {
    watch: true,
    outFile: 'browser',
    publicUrl: './',
    hmr: true,
    hmrHostname: 'localhost',
  })

  hostBundler.on('bundled', (bundle) => {
    browserBundler.onChange(path.join(root, 'src/browser/hmr.ts'))
  })

  // ;[hostBundler, browserBundler].forEach(async (bundler) => {
  //   await new Promise((resolve) => {
  //     bundler.on('bundled', resolve)
  //     bundler.bundle()
  //   })
  // })

  await Promise.all([hostBundler.bundle(), browserBundler.bundle()])
}

runBundle()
