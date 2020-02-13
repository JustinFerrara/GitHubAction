
/*
 * AB Test configuration schema
 *
  {
    site: [
      {
        id: <String> | required,
        variant: {
          control: <Number: positive number> | required,
          variant: <Number: positive number>,
          ...
        }
      }
    ]
  }
 *
 */
module.exports = {
  bi: [
    {
      id: 'masthead',
      variant: {
        control: 30,
        variant: 40,
        variant2: 30,
      },
    },
    {
      id: 'bi6-under-bullets',
      variant: {
        control: 50,
        variant: 50,
      },
    },
  ],

  ins: [
    {
      id: 'ins6-small-top-image',
      variant: {
        control: 90,
        variant: 10,
      },
    },
    {
      id: 'gpt-sra',
      variant: {
        control: 50,
        variant: 50,
      },
    },
    {
      id: 'breakingNews',
      variant: {
        control: 34,
        variant: 33,
        variant2: 33,
      },
    },
  ],

  both: [
    {
      id: 'commerce-product-cta-alternate',
      variant: {
        control: 50,
        variant: 50,
      },
    },
    {
      id: 'commerce-buyguide-alt-button-placement',
      variant: {
        control: 34,
        variant1: 33,
        variant2: 33,
      },
    },
    {
      id: 'subnav-sticky',
      variant: {
        control: 50,
        variant: 50,
      },
    },
  ],
};
