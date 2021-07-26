module.exports = {
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Access-Control-Allow-Origin',
              value: '*',   // TODO: change it to a more secure domain soon
            },
          ],
        },
      ]
    },
  }