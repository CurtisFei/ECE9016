import { LinRouter, NotFound, disableLoading } from 'lin-mizar';
import { TrackDao } from '../../dao/track';

// track 的红图实例
const trackApi = new LinRouter({
  prefix: '/v1/track',
  module: 'track'
});

const trackDto = new TrackDao();

trackApi.get('/search', async ctx => {
  let { trackList, total } = await trackDto.getTrackListByQueryParams(ctx.request.query)
  ctx.json({
    items: trackList,
    total,
    count: ctx.request.query.count,
    page: ctx.request.query.page
  })
})

trackApi.get('/getAllTrackIds', async ctx => {
  let tracks = await trackDto.getAllTrackIds()
  ctx.json(tracks)
})

trackApi.get('/:id', async ctx => {
  let id = ctx.params.id
  let track = await trackDto.getTrack(id)
  ctx.json(track)
})


module.exports = { trackApi, [disableLoading]: false };