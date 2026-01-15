import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'MovieFund Documentation',
  tagline: 'Fractional Movie Investment Platform',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://moviebitfund.kcolbchain.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/docs/',
  trailingSlash: true, // Use trailing slashes for better Next.js compatibility

  // GitHub pages deployment config.
  organizationName: 'abhicris',
  projectName: 'MovieFund',

  onBrokenLinks: 'warn',
  markdown: {
    mermaid: true,
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          editUrl: 'https://github.com/abhicris/MovieFund/tree/main/',
          remarkPlugins: [],
          rehypePlugins: [],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'MovieFund Docs',
      logo: {
        alt: 'MovieFund Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://moviebitfund.kcolbchain.com',
          label: 'Platform',
          position: 'right',
        },
        {
          href: 'https://github.com/abhicris/MovieFund',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Business & Strategy',
              to: '/category/business--strategy',
            },
            {
              label: 'Operations',
              to: '/category/operations',
            },
            {
              label: 'Development',
              to: '/category/development',
            },
          ],
        },
        {
          title: 'Platform',
          items: [
            {
              label: 'Home',
              href: 'https://moviebitfund.kcolbchain.com',
            },
            {
              label: 'Opportunities',
              href: 'https://moviebitfund.kcolbchain.com/opportunities',
            },
            {
              label: 'About',
              href: 'https://moviebitfund.kcolbchain.com/about',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/abhicris/MovieFund',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} MovieFund. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    // Algolia search can be added later if needed
    // algolia: {
    //   appId: 'YOUR_APP_ID',
    //   apiKey: 'YOUR_SEARCH_API_KEY',
    //   indexName: 'YOUR_INDEX_NAME',
    // },
  } satisfies Preset.ThemeConfig,
};

export default config;









