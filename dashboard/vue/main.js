import Vue from 'vue';
import lang from 'element-ui/lib/locale/lang/ru-RU'
import locale from 'element-ui/lib/locale'
import App from '@/panels/Main';
import {
  // Pagination,
  // Dialog,
  // Autocomplete,
  // Dropdown,
  // DropdownMenu,
  // DropdownItem,
  // Menu,
  // Submenu,
  // MenuItem,
  // MenuItemGroup,
  Input,
  InputNumber,
  // Radio,
  // RadioGroup,
  // RadioButton,
  // Checkbox,
  // CheckboxButton,
  // CheckboxGroup,
  Switch,
  Select,
  Option,
  // OptionGroup,
  Button,
  ButtonGroup,
  // Table,
  // TableColumn,
  // DatePicker,
  // TimeSelect,
  // TimePicker,
  // Popover,
  // Tooltip,
  // Breadcrumb,
  // BreadcrumbItem,
  // Form,
  // FormItem,
  // Tabs,
  // TabPane,
  // Tag,
  // Tree,
  // Alert,
  Slider,
  Icon,
  Row,
  Col,
  // Upload,
  Progress,
  // Spinner,
  // Badge,
  // Card,
  // Rate,
  // Steps,
  // Step,
  // Carousel,
  // CarouselItem,
  Collapse,
  CollapseItem,
  // Cascader,
  // ColorPicker,
  // Transfer,
  Container,
  // Header,
  // Aside,
  // Main,
  // Footer,
  // Timeline,
  // TimelineItem,
  Link,
  // Divider,
  // Image,
  // Calendar,
  // Backtop,
  // PageHeader,
  // CascaderPanel,
  // Loading,
  // MessageBox,
  // Message,
  // Notification
  Scrollbar
} from 'element-ui';

locale.use(lang)

Vue.use(Scrollbar);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Switch);
Vue.use(Select, { locale });
Vue.use(Option);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(Progress);
Vue.use(Slider);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Container);
Vue.use(Link);

new Vue({
  name: 'App',
  components: { App },
  template: '<app/>',
  render: (h) => h(App),
}).$mount('#el');
