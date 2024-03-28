import { InfoCrudMixin } from 'lin-mizar';
import { merge } from 'lodash';
import { Sequelize, Model } from 'sequelize';
import sequelize from '../lib/db';

class Track extends Model {
  toJSON() {
    const origin = {
      track_id: this.track_id,
      album_id: this.album_id,
      album_title: this.album_title,
      artist_id: this.artist_id,
      artist_name: this.artist_name,
      tags: this.tags,
      bit_rate: this.bit_rate,
      track_date_created: this.track_date_created,
      track_date_recorded: this.track_date_recorded,
      track_disc_number: this.track_disc_number,
      track_duration: this.track_duration,
      track_genres: this.track_genres,
      track_number: this.track_number,
      track_title: this.track_title
    };
    return origin;
  }
}


Track.init(
  {
    track_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    album_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    album_title: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    artist_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    artist_name: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    tags: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    bit_rate: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    track_date_created: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    track_date_recorded: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    track_disc_number: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    track_duration: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    track_genres: {
      type: Sequelize.STRING(500),
      allowNull: true
    },
    track_number: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    track_title: {
      type: Sequelize.STRING(255),
      allowNull: true
    }
  },
  merge(
    {
      sequelize,
      tableName: 'track',
      modelName: 'track',
      timestamps: false,  // 框架默认会加上时间的字段，加上该配置去掉时间字段
    },
    InfoCrudMixin.options
  )
);

export { Track };