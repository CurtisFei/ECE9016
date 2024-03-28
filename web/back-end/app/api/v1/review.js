import { LinRouter, disableLoading, InfoCrudMixin } from 'lin-mizar';
import { ReviewDao } from '../../dao/review';
import { adminRequired, loginRequired, mountUser } from '../../middleware/jwt';


const reviewApi = new LinRouter({
  prefix: '/v1/review',
  module: 'review'
});

const reviewDto = new ReviewDao()

reviewApi.linGet(
  'get all review',
  '/',
  adminRequired,
  async ctx => {
    let reviewList = await reviewDto.getAll()
    ctx.json(reviewList)
  }
)

reviewApi.get('/getReviewByplaylistName', async ctx => {
  let playlistName = ctx.request.query.playlist_name
  let reviewList = await reviewDto.getReviewByPlaylistName(playlistName)
  ctx.json(reviewList)
})

reviewApi.post('/updateReviewContestedByID', async ctx => {
  let body = ctx.request.body
    await reviewDto.updateReviewByID(body.review_id, body.is_contested, body.type)
    ctx.success({
      code: 10303
    });
})

// reviewApi.linPut(
//   'update review by review ID',
//   '/updateReviewContestedByID',
//   loginRequired,
//   async ctx => {
//     let body = ctx.request.body
//     await reviewDto.updateReviewByID(body.review_id, body.is_contested, body.type, ctx.currentUser.email)
//     ctx.success({
//       code: 10303
//     });
//   }
// )

reviewApi.linPut(
  'update review status by review ID',
  '/updateReviewStatusByID',
  adminRequired,
  async ctx => {
    let body = ctx.request.body
    await reviewDto.updateReviewStatusByID(body.id, body.status)
    ctx.success({
      code: 10303
    });
  }
)

reviewApi.linPost(
  'add review by playlist id',
  '/addReviewByplaylistId',
  reviewApi.permission('add review by playlist id'),
  loginRequired,
  async ctx => {
    await reviewDto.addReview(ctx.request.body, ctx.currentUser.id, ctx.currentUser.email)
    ctx.success({
      code: 10301
    });
  }
)

module.exports = { reviewApi, [disableLoading]: false };

