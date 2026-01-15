import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Business & Strategy',
      items: [
        'CEO_PRODUCT_ROADMAP',
        'BUSINESS_MODEL',
        'PLATFORM_PLAN',
      ],
    },
    {
      type: 'category',
      label: 'Operations',
      items: [
        'MOVIE_OPERATIONS',
        'LEGAL_AGREEMENTS',
        'PARTNERSHIPS',
      ],
    },
    {
      type: 'category',
      label: 'Marketing & Launch',
      items: [
        'MARKETING_LAUNCH_PLAN',
      ],
    },
    {
      type: 'category',
      label: 'Development',
      items: [
        'DEV_ROADMAP',
        'DEMO_STATUS',
      ],
    },
    {
      type: 'category',
      label: 'Investor Materials',
      items: [
        {
          type: 'link',
          label: 'Investor Deck',
          href: '#',
        },
      ],
    },
  ],
};

export default sidebars;









