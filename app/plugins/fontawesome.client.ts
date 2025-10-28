import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faHome,
  faUsers,
  faBuilding,
  faChartBar,
  faFileAlt,
  faCog,
  faSignOutAlt,
  faUser,
  faBell,
  faLifeRing,
  faBars,
  faTimes,
  faExclamationTriangle,
  faTimesCircle,
  faInfoCircle,
  faCheckCircle,
  faRobot,
  faQuestionCircle,
  faShoppingCart,
  faUtensils,
  faEdit,
  faTrash,
  faChevronDown,
  faChevronRight,
  faBoxOpen,
  faFolderOpen,
  faPlus,
  faLayerGroup,
  faDollarSign,
  faEllipsisH,
  faPizzaSlice,
  faHamburger,
  faCoffee,
  faWineGlass,
  faIceCream,
  faBreadSlice,
  faFish,
  faCheese,
  faAppleAlt,
  faSeedling,
  faBirthdayCake,
  faCloudUploadAlt,
  faSave,
  faSearch,
  faPhone,
  faDownload,
  faFilePdf,
  faSpinner,
  faFileExcel
} from '@fortawesome/free-solid-svg-icons'

// Importar ícones de marca (brands)
import {
  faWhatsapp
} from '@fortawesome/free-brands-svg-icons'

// This is important, we are going to let Nuxt worry about the CSS
config.autoAddCss = false

// You can add your icons directly in this plugin. See other examples for how you
// can add other styles or just individual icons.
library.add(
  faHome,
  faUsers,
  faBuilding,
  faChartBar,
  faFileAlt,
  faCog,
  faSignOutAlt,
  faUser,
  faBell,
  faLifeRing,
  faBars,
  faTimes,
  faExclamationTriangle,
  faTimesCircle,
  faInfoCircle,
  faCheckCircle,
  faRobot,
  faQuestionCircle,
  faShoppingCart,
  faUtensils,
  faEdit,
  faTrash,
  faChevronDown,
  faChevronRight,
  faBoxOpen,
  faFolderOpen,
  faPlus,
  faLayerGroup,
  faDollarSign,
  faEllipsisH,
  faPizzaSlice,
  faHamburger,
  faCoffee,
  faWineGlass,
  faIceCream,
  faBreadSlice,
  faFish,
  faCheese,
  faAppleAlt,
  faSeedling,
  faBirthdayCake,
  faCloudUploadAlt,
  faSave,
  faSearch,
  faPhone,
  faDownload,
  faFilePdf,
  faSpinner,
  faFileExcel
)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})
