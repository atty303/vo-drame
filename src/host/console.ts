export const console = {
  log: function(...params: any[]) {
    const args = []
    for (let i = 0; i < params.length; ++i) {
      args.push("" + params[i])
    }
    $.writeln(args.join(' '))
  }
}
