import { LinRouter, NotFound, disableLoading } from 'lin-mizar';
import { GenreDao } from "../../dao/genre";


const genreApi = new LinRouter({
  prefix: '/v1/genre',
  module: 'genre'
});

const genreDto = new GenreDao()

genreApi.get('/', async ctx => {
  let genreList = await genreDto.getAll()
  ctx.json(genreList)
})




module.exports = { genreApi, [disableLoading]: false };