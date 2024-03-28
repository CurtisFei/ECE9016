import { LinRouter, NotFound, disableLoading } from 'lin-mizar';
import { ArtistDao } from '../../dao/artist';

const artistApi = new LinRouter({
  prefix: '/v1/artist',
  module: 'artist'
});

const artistDto = new ArtistDao()

artistApi.get('/getArtistIdsByName', async ctx => {
  let artistIds = await artistDto.getArtistIdsByName(ctx.request.query)
  ctx.json(artistIds)
})

artistApi.get('/:id', async ctx => {
  let id = ctx.params.id
  let artist = await artistDto.getArtist(id)
  ctx.json(artist)
})

module.exports = { artistApi, [disableLoading]: false };