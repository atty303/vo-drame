export const console = {
  log: function(...params: any[]) {
    const args = []
    for (let i = 0; i < params.length; ++i) {
      if (typeof params[i] === 'object') {
        args.push(JSON.stringify(params[i]))
      } else {
        args.push('' + params[i])
      }
    }
    $.writeln(args.join(' '))
  }
}
