import { InfoCrudMixin } from 'lin-mizar';
import { merge } from 'lodash';
import { Sequelize, Model } from 'sequelize';
import sequelize from '../lib/db';

class Playlist extends Model {
  toJSON() {
    const origin = {
      id: this.id,
      name: this.name,
      track_list: this.track_list,
      track_number: this.track_number,
      total_playtime: this.total_playtime,
      status: this.status,
      creator: this.creator,
      rating: this.rating,
      description: this.description,
      tracks_info: this.tracks_info
    };
    return origin;
  }
}

Playlist.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING(60),
      allowNull: false
    },
    track_list: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    track_number: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    total_playtime: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: '0:0:0'
    },
    status: {
      type: Sequelize.INTEGER,
      comment: '0:disable 1:display',
      defaultValue: 0
    },
    creator: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    description: {
      type: Sequelize.STRING(255),
      allowNull: false
    }
  },
  merge(
    {
      sequelize,
      tableName: 'playlist',
      modelName: 'playlist'
    },
    InfoCrudMixin.options
  )
);

export { Playlist }