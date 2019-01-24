const { exec } = require('child_process')
const { resolve } = require('path')
const { argv } = require('yargs')

const execCmd = (cmd) => {
  return new Promise((resolve, reject) => {
    console.log(`🏃 Running command "${cmd}"`)
    exec(cmd, (err, stout, sterr) => {
      if (err) {
        console.error(sterr)
        reject(sterr)
      }
      console.log(stout)
      resolve(stout)
    })
  })
}

const run = async () => {
  const { platform } = argv
  console.log(`💻 Packaging platform: ${platform}`)
  console.log(`🗂 Change directory to "${resolve(__dirname, './release')}"`)
  process.chdir(resolve(__dirname, './release'))
  await execCmd('npm install')
  const buildCommand = platform === 'win'
    ? 'electron-packager . Kaleido --platform=win32 --icon=./favicon.ico --overwrite'
    : 'electron-packager . Kaleido --platform=darwin --icon=./icon.icns --overwrite'
  await execCmd(buildCommand)
  console.log('💖 Packaging done!')
}

run()
