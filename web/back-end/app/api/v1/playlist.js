import { LinRouter, disableLoading, InfoCrudMixin } from 'lin-mizar';
import { PlaylistDao } from '../../dao/playlist';
import { ReviewDao } from '../../dao/review';
import { TrackDao } from '../../dao/track';
import { loginRequired, mountUser } from '../../middleware/jwt';


const playlistApi = new LinRouter({
  prefix: '/v1/playlist',
  module: 'playlist'
});

const playlistDto = new PlaylistDao()
const trackDto = new TrackDao()
const reviewDto = new ReviewDao()


playlistApi.linGet(
  'get playlist statistics',
  '/getPlaylistStatistics',
  playlistApi.permission('get playlist statistics'),
  async ctx => {
    let results = []
    let rows = await reviewDto.getRatingAvg()

    let { playlists, total } = await playlistDto.getPlaylistTrackNumberByQueryParams(ctx.request.query)

    for (const el of playlists) {
      for (const rw_el of rows) {
        if (el.id == rw_el.playlist_id) {
          el.rating = parseInt(rw_el.dataValues.avg_rating)
          break
        }
      }
      if (!el.rating && el.rating != 0) {
        el.rating = null
      }

      let tracks = []
      if (el.track_list) {
        tracks = await trackDto.getTracksById(el.track_list.split(','))
      } else {
        tracks = []
      }
      el.tracks_info = tracks
      results.push(el)
    }


    ctx.json({
      items: results,
      total,
      count: ctx.request.query.count,
      page: ctx.request.query.page
    })
  }
)

playlistApi.linGet(
  'get playlist statistics by user',
  '/getPlaylistStatisticsByUser',
  playlistApi.permission('get track ids by playlist name'),
  loginRequired,
  async ctx => {
    let results = []
    let currentuser = ctx.currentUser
    let username = currentuser != null ? currentuser.email : ''

    let playlistsByCreator = await playlistDto.getPlaylistIdsByCreator(username);

    let playlistIdsByCreator = []
    playlistsByCreator.forEach(e => {
      playlistIdsByCreator.push(e.id)
    });
    let rows = await reviewDto.getRatingAvgByPlaylistIds(playlistIdsByCreator)

    let { playlists, total } = await playlistDto.getPlaylistTrackNumberByQueryParamsAndCreator(ctx.request.query, username)

    for (const el of playlists) {
      for (const rw_el of rows) {
        if (el.id == rw_el.playlist_id) {
          el.rating = parseInt(rw_el.dataValues.avg_rating)
          break
        }
      }
      if (!el.rating && el.rating != 0) {
        el.rating = null
      }
      let tracks = []
      if (el.track_list) {
        tracks = await trackDto.getTracksById(el.track_list.split(','))
      } else {
        tracks = []
      }
      el.tracks_info = tracks
      results.push(el)
    }


    ctx.json({
      items: results,
      total,
      count: ctx.request.query.count,
      page: ctx.request.query.page
    })
  }
)

playlistApi.linGet(
  'get public tracks by playlist name',
  '/getPublicTracksByName',
  playlistApi.permission('get track ids by playlist name'),
  getTracksByName
)

playlistApi.linGet(
  'get tracks by playlist name',
  '/getTracksByName',
  playlistApi.permission('get track ids by playlist name'),
  loginRequired,
  getTracksByName
)

async function getTracksByName(ctx) {
  let currentuser = ctx.currentUser
  let username = currentuser != null ? currentuser.email : ''
  let trackList = await playlistDto.getTrackIdsByName(ctx.request.query.name, username)
  let trackIds = []
  let tracks = []
  if (trackList) {
    tracks = await trackDto.getTracksById(trackList.split(','))
  }
  ctx.json(tracks)
}

playlistApi.linPost(
  'create playlist',
  '/create',
  playlistApi.permission('create playlist'),
  loginRequired,
  async ctx => {
    await playlistDto.createPlaylist(ctx.request.body.name, ctx.currentUser.email, ctx.request.body.status, ctx.request.body.description)
    ctx.success({
      code: 10272
    });
  }
)

playlistApi.linPut(
  'update tracks by playlist name',
  '/updateTracksByName',
  playlistApi.permission('update tracks by playlist name'),
  loginRequired,
  async ctx => {
    let body = ctx.request.body
    await playlistDto.updateTracksByName(body.name, body.track_list, ctx.currentUser.email)
    ctx.success({
      code: 10273
    });
  }
)

playlistApi.linPut(
  'update playlist by playlist id',
  '/updatePlaylistById',
  playlistApi.permission('update playlist by playlist id'),
  loginRequired,
  async ctx => {
    await playlistDto.updatePlaylistByid(ctx.request.body)
    ctx.success({
      code: 10276
    });
  }
)

playlistApi.linDelete(
  'delete playlist by name',
  '/:name',
  playlistApi.permission('delete playlistby name'),
  loginRequired,
  async ctx => {
    let name = ctx.params.name
    await playlistDto.deletePlaylistByName(name, ctx.currentUser.email)
    ctx.success({
      code: 10275
    });
  }
)





module.exports = { playlistApi, [disableLoading]: false };