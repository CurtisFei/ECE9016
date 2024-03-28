import { InfoCrudMixin } from 'lin-mizar';
import { merge } from 'lodash';
import { Sequelize, Model } from 'sequelize';
import sequelize from '../lib/db';

class Review extends Model {
  toJSON() {
    const origin = {
      id: this.id,
      content: this.content,
      playlist_id: this.playlist_id,
      reviewer_id: this.reviewer_id,
      reviewer_name: this.reviewer_name,
      is_contested: this.is_contested,
      status: this.status,
      rating: this.rating,
      date_request_received: this.date_request_received,
      date_notice_sent: this.date_notice_sent,
      date_dispute_received: this.date_dispute_received
    };
    return origin;
  }
}

Review.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    content: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    playlist_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    reviewer_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    reviewer_name: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    status: {
      type: Sequelize.INTEGER,
      comment: '0:disable 1:display',
      defaultValue: 1
    },
    rating: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    date_request_received: {
      type: Sequelize.DATE,
      allowNull: true
    },
    date_notice_sent: {
      type: Sequelize.DATE,
      allowNull: true
    },
    date_dispute_received: {
      type: Sequelize.DATE,
      allowNull: true
    }
  },
  merge(
    {
      sequelize,
      tableName: 'review',
      modelName: 'review'
    },
    InfoCrudMixin.options
  )
);

export { Review };