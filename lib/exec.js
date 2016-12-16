
module.exports = (cmd, args=[]) =>
  new Promise(function (resolve, reject) {
    require('child_process')
      .spawn(cmd, args, { stdio: 'inherit', shell: true })
      .on('exit', resolve)
      .on('error', reject)
  })
