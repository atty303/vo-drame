import {Bridge} from '../shared'

if (!$.global[Bridge.NamespaceInGlobal]) {
  $.global[Bridge.NamespaceInGlobal] = {}
}

export const ns: any = $.global[Bridge.NamespaceInGlobal]
