import Sequelize from 'sequelize';
import { Artist } from '../model/artist';

class ArtistDao {
  async getArtist(id) {
    const artist = await Artist.findOne({
      where: {
        id: id
      }
    });
    return artist;
  }

  async getArtistIdsByName(params) {
    let whereCondition = this.searchWhereCondition(params)

    const rows = await Artist.findAll({
      attributes: ['id'],
      where: whereCondition,
    })

    let artistIds = []
    rows.forEach(e => {
      artistIds.push(e.id)
    })
    return artistIds
  }

  searchWhereCondition(params) {
    let whereCondition = {}

    for (const key in params) {
      if (key == 'count' || key == 'page')
        continue
      if (key.includes('id')) {
        whereCondition[key] = params[key]
      } else {
        whereCondition[key] = { [Sequelize.Op.substring]: params[key] }
      }
    }
    return whereCondition
  }
}

export { ArtistDao };