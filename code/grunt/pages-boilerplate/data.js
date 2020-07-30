// 模板数据
const data = {
  menus: [{
      name: 'Home',
      icon: 'aperture',
      link: 'index.html'
    },
    {
      name: 'Features',
      link: 'features.html'
    },
    {
      name: 'About',
      link: 'about.html'
    },
    {
      name: 'Contact',
      link: '#',
      children: [{
          name: 'Twitter',
          link: 'https://twitter.com/'
        },
        {
          name: 'About',
          link: 'https://weibo.com/'
        },
        {
          name: 'divider'
        },
        {
          name: 'About',
          link: 'https://github.com/'
        }
      ]
    }
  ],
  pkg: require('./package.json'),
  date: new Date()
}

module.exports = data