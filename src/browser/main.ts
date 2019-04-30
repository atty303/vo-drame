import Vue from 'vue'

import App from './App.vue'
import {premiereApiClient} from './global'

// stylesheets
import './styles/main.styl'
import './styles/quasar.styl'
import '../../node_modules/handsontable/dist/handsontable.full.css'
import '@quasar/extras/material-icons/material-icons.css'

import {
  default as Quasar,
  CloseMenu,
  ClosePopup,
  Notify,
  QAvatar,
  QBreadcrumbs,
  QBreadcrumbsEl,
  QBtn,
  QBtnDropdown,
  QDialog,
  QDrawer,
  QField,
  QFooter,
  QHeader,
  QIcon,
  QInput,
  QItem,
  QItemLabel,
  QItemSection,
  QLayout,
  QList,
  QPage,
  QPageContainer,
  QRadio,
  QSelect,
  QSeparator,
  QSpace,
  QTable,
  QTd,
  QToggle,
  QToolbar,
  QToolbarTitle,
  QTr,
  QUploader,
  Ripple,
} from 'quasar'

Vue.use(Quasar, {
  config: {},
  components: {
    QAvatar,
    QBreadcrumbs,
    QBreadcrumbsEl,
    QBtn,
    QBtnDropdown,
    QDialog,
    QDrawer,
    QField,
    QFooter,
    QHeader,
    QIcon,
    QInput,
    QItem,
    QItemLabel,
    QItemSection,
    QLayout,
    QList,
    QPage,
    QPageContainer,
    QRadio,
    QSelect,
    QSeparator,
    QSpace,
    QTable,
    QTd,
    QToggle,
    QToolbar,
    QToolbarTitle,
    QTr,
    QUploader,
  },
  directives: {
    CloseMenu,
    ClosePopup,
    Ripple,
  },
  plugins: {
    Notify,
  },
})

Vue.config.productionTip = false

if (module.hot) {
  module.hot.accept(() => onLoad(true))
  module.hot.dispose(() => onUnload(true))
}

function onLoad(isHotLoading: boolean) {
  if (!isHotLoading) premiereApiClient.start()
}

function onUnload(isHotLoading: boolean) {
  premiereApiClient.close()
}

new Vue({
  render: (h) => h(App),
}).$mount('#app')

onLoad(false)
