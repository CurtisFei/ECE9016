import { NotFound, Forbidden } from 'lin-mizar';
import { Review } from '../model/review';
import Sequelize from 'sequelize';
import { PlaylistDao } from './playlist';

const moment = require('moment');

class ReviewDao {
  async getRatingAvg() {
    const rows = await Review.findAll({
      attributes: ['playlist_id',
        [Sequelize.fn('AVG', Sequelize.col('rating')), 'avg_rating'],
      ],
      where: {
        status: 1
      },
      group: 'playlist_id'
    })
    return rows
  }

  async getRatingAvgByPlaylistIds(playlist_ids) {
    const rows = await Review.findAll({
      attributes: ['playlist_id',
        [Sequelize.fn('AVG', Sequelize.col('rating')), 'avg_rating'],
      ],
      where: {
        playlist_id: {
          [Sequelize.Op.in]: playlist_ids
        },
        status: 1
      },
      group: 'playlist_id'
    })
    return rows
  }

  async getAll() {
    const reviewList = await Review.findAll()
    return reviewList;
  }

  async updateReviewByID(review_id, is_contested, type) {
    const review = await Review.findOne({
      where: {
        id: review_id
      }
    });
    if (!review_id) {
      throw new Forbidden({
        code: 10300
      });
    }
    
    let time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    if(type == "request"){
      review.date_request_received = time;
    }else if(type == "dispute"){
      review.date_dispute_received = time;
    }else if(type == "notice"){
      review.date_notice_sent = time;
    }

    review.is_contested = is_contested;
    // review.status = 1;
    await review.save();
  }

  async updateReviewStatusByID(review_id, status) {
    const review = await Review.findOne({
      where: {
        id: review_id
      }
    });
    if (!review_id) {
      throw new Forbidden({
        code: 10300
      });
    }
    review.status = status

    await review.save()
  }

  async addReview(body, userId, username) {
    const review = await Review.findOne({
      where: {
        playlist_id: body.playlist_id,
        reviewer_id: userId
      }
    });

    if (review) {
      throw new Forbidden({
        code: 10302
      });
    }

    const rev = new Review();
    if (body.rating) {
      rev.rating = body.rating
    }
    if (body.comment) {
      rev.content = body.comment
    }
    rev.playlist_id = body.playlist_id
    rev.reviewer_id = userId
    rev.reviewer_name = username
    await rev.save()
  }

  async getReviewByPlaylistName(playlistName) {
    const playlistDto = new PlaylistDao()
    const playlistIdList = await playlistDto.getPlaylistIdsByName(playlistName)

    let playlistIds = []
    playlistIdList.forEach(e => {
      playlistIds.push(e.id)
    })

    const reviews = await Review.findAll({
      where: {
        playlist_id: {
          [Sequelize.Op.in]: playlistIds
        },
        status: 1
      }
    })
    return reviews
  }


}

export { ReviewDao };