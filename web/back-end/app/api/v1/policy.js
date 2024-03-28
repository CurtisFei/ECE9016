import { LinRouter, disableLoading, InfoCrudMixin } from 'lin-mizar';
import { adminRequired, loginRequired, mountUser } from '../../middleware/jwt';

const fs = require('fs');
const policyApi = new LinRouter({
  prefix: '/v1/policy',
  module: 'policy'
});


policyApi.post('/getFile', async ctx => {
  let filename = ctx.request.body.filename;
  // console.log("==========="+__dirname);
  let filedata = [];
  try {
    filedata = fs.readFileSync('./app/policy/' + filename + '.txt', 'utf-8');
    // console.log(filedata)
  } catch (error) {
    console.log(error);
  }
  ctx.json({
    data: filedata
  });
})

policyApi.linPost(
  'updatePolicy',
  '/updatePolicy',
  adminRequired,
  async ctx => {
    let body = ctx.request.body;
    try {
      fs.writeFileSync('./app/policy/' + body.filename + '.txt', body.content);
    } catch (error) {
      console.log(error);
    }
    ctx.success({
      code: 10272,
      message: "update policy successfully!"
    });
  }
)

// policyApi.post('/updatePolicy', async ctx => {
//      let body = ctx.request.body;
//      try {
//        fs.writeFileSync('/Users/marshmallow/GitHub/ece9065-yfei55-hwei47-szhou379-lab4/back-end/app/policy/'+ body.filename +'.txt', body.content);
//      } catch (error) {
//        console.log(error);
//      }
//      ctx.success({
//        code: 10272,
//        message:"update policy successfully!"
//      });
//  })


module.exports = { policyApi, [disableLoading]: false };