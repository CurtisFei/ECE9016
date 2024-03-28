import { InfoCrudMixin } from 'lin-mizar';
import { merge } from 'lodash';
import { Sequelize, Model } from 'sequelize';
import sequelize from '../lib/db';

class Artist extends Model {
  toJSON() {
    const origin = {
      id: this.id,
      year_begin: this.year_end,
      album_title: this.album_title,
      associated_labels: this.associated_labels,
      comments: this.comments,
      contact: this.contact,
      date_created: this.date_created,
      donation_url: this.donation_url,
      favorites: this.favorites,
      handle: this.handle,
      name: this.name,
      website: this.website
    };
    return origin;
  }
}


Artist.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    year_begin: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    year_end: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    associated_labels: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    comments: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    contact: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    date_created: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    donation_url: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    favorites: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    handle: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    website: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
  },
  merge(
    {
      sequelize,
      tableName: 'artist',
      modelName: 'artist',
      timestamps: false,  // 框架默认会加上时间的字段，加上该配置去掉时间字段
    },
    InfoCrudMixin.options
  )
);

export { Artist };