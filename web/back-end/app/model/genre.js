import { InfoCrudMixin } from 'lin-mizar';
import { merge } from 'lodash';
import { Sequelize, Model } from 'sequelize';
import sequelize from '../lib/db';

class Genre extends Model {
  toJSON() {
    const origin = {
      genre_id: this.genre_id,
      tracks_no: this.tracks_no,
      parent: this.parent,
      title: this.title,
      top_level: this.top_level
    };
    return origin;
  }
}

Genre.init(
  {
    genre_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    tracks_no: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    parent: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    title: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    top_level: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  },
  merge(
    {
      sequelize,
      tableName: 'genre',
      modelName: 'genre',
      timestamps: false,  // 框架默认会加上时间的字段，加上该配置去掉时间字段
    },
    InfoCrudMixin.options
  )
);

export { Genre };