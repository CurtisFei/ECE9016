import Sequelize from 'sequelize';
import { Genre } from '../model/genre';

class GenreDao {
  async getAll() {
    const genreList = await Genre.findAll()
    return genreList;
  }
}

export { GenreDao }