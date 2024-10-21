import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  course: icon('ic_course'),
  company: icon('ic_company'),
  hire: icon('ic-mingcute_flash-fill'),
};

// ----------------------------------------------------------------------

export const navData = [
  // DASHBOARD
  // ----------------------------------------------------------------------
  {
    subheader: 'Dashboard',
    items: [{ title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.analytics }],
  },
  // APPLICATION
  // ----------------------------------------------------------------------
  {
    subheader: 'Application',
    items: [
      {
        title: 'Job Post',
        path: paths.application.group.root,
        icon: ICONS.job,
        children: [
          { title: 'view', path: paths.application.group.view },
          { title: 'create', path: paths.application.group.create },
          {
            title: 'Interviews',
            path: paths.application.interviews.root,
            icon: ICONS.course,
            children: [
              { title: 'list', path: paths.application.interviews.group.list },
              {
                title: 'View Shared Interviews',
                path: paths.application.interviews.group.sharedInterviews,
              },
            ],
          },
          {
            title: 'Schedules',
            path: paths.application.schedules,
            icon: ICONS.calendar,
          },
        ],
      },
    ],
  },

  // ADMIN
  // ----------------------------------------------------------------------
  {
    subheader: 'Admin',
    items: [
      {
        title: 'Organization',
        path: paths.admin.organization,
        icon: ICONS.banking,
      },
      {
        title: 'Companies',
        path: paths.admin.companies,
        icon: ICONS.company,
      },
      // {
      //   title: 'Subscription Plans',
      //   path: paths.admin.subscription,
      //   icon: ICONS.invoice,
      // },
      {
        title: 'Instant Hire',
        path: paths.admin.instantHire,
        icon: ICONS.hire,
      },
      {
        title: 'Credits',
        icon: ICONS.order,
        path: paths.admin.credits.root,
        children: [
          { title: 'buy', path: paths.admin.credits.group.buy },
          { title: 'history', path: paths.admin.credits.group.history },
        ],
      },
    ],
  },
];
