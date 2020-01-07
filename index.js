const xray = require('x-ray')
const S3 = require('aws-sdk/clients/s3');
const find = require('lodash.find');
const env = require('dotenv').config()

const s3 = new S3({region: process.env.AWS_S3_REGION});


const x = xray({  filters: {
    formatImageFull: function(value) {
      return typeof value === 'string' && (value.indexOf('-q.jpg') > 0 || value.indexOf('-n.jpg') > 0) ? value.replace(/-[a-z]\.jpg/ig, '.jpg') : value;
    },
    formatPrice: function(value) {
      return typeof value === 'string'? value.replace('Hinta: ', '') : value;
    },
    formatId: function(value) {
      return typeof value === 'string'? parseInt(value.split("/ilmoitus/")[1]) : value;
    }
  }
})

var params = {Bucket: 'pubgcase', Key: 'results.json'};

async function getFile(filename) {
  const response = await s3.getObject(params, (err) => {
    if (err) {
      // handle errors
    }
  }).promise();
  return response.Body.toString(); // your file as a string
}

getFile().then((fileStr)=> {
  const oldData = JSON.parse(fileStr);

  const stream = x('https://muusikoiden.net/tori/haku.php?keyword=mikseri&city=091&type=sell&with_image=1&sort=new', 'table+script+table table[cellpadding="2"]', [
    {
      id:    '.bg2 .tori_title a@href | formatId',
      link:  '.bg2 .tori_title a@href',
      title: '.bg2 .tori_title a',
      desc:  '.msg',
      price: '.msg+p | formatPrice',
      img:   'tr:nth-of-type(4) td[align="right"] img@src',
      imgFull:   'tr:nth-of-type(4) td[align="right"] img@src | formatImageFull',
    }
  ])
    .paginate('table p td[align="right"] a[href*="/tori/haku.php?"]:last-of-type@href')
    .limit(2)
    .stream()
    // .write('results.json')

  const chunks = [];

  stream.on("data", function (chunk) {
    chunks.push(chunk);
  });

  stream.on("end", function () {
    const body = Buffer.concat(chunks)
    const newData = JSON.parse(Buffer.concat(chunks).toString());

    const newItems = newData.filter((a) => {
      return !find(oldData, (b) => { return a.id === b.id});
    });

    console.log(newItems);

    params = {ACL: 'private', Bucket: process.env.AWS_S3_BUCKET, Key: 'results.json', Body: body};

    s3.upload(params, function(err, res) {
      console.log(res);
    });
  });
});
