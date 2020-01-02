const xray = require('x-ray')
const x = xray({  filters: {
    jpegFull: function(value) {
      return typeof value === 'string' && (value.indexOf('-q.jpg') > 0 || value.indexOf('-n.jpg') > 0) ? value.replace(/-[a-z]\.jpg/ig, '.jpg') : value;
    },
    formatPrice: function(value) {
      return typeof value === 'string'? value.replace('Hinta: ', '') : value;
    },
    formatId: function(value) {
      return typeof value === 'string'? value.split("/ilmoitus/")[1] : value;
    }
  }
})



x('https://muusikoiden.net/tori/haku.php?keyword=mikseri&city=091&type=sell', 'table+script+table table[cellpadding="2"]', [
  {
    id:    '.bg2 .tori_title a@href | formatId',
    link:  '.bg2 .tori_title a@href',
    title: '.bg2 .tori_title a',
    desc:  '.msg',
    price: '.msg+p | formatPrice',
    img:   'tr:nth-of-type(4) td[align="right"] img@src',
    imgFull:   'tr:nth-of-type(4) td[align="right"] img@src | jpegFull',
  }
])
  .paginate('table p td[align="right"] a[href*="/tori/haku.php?"]:last-of-type@href')
  .limit(2)
  .write('results.json')