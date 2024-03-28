import { NotFound, Forbidden } from 'lin-mizar';
import Sequelize from 'sequelize';
import { Track } from '../model/track';

class TrackDao {
  async getAllTrackIds() {
    const trackIds = await Track.findAll({
      attributes: ['track_id']
    });

    let trackAllIds = []
    trackIds.forEach(e => {
      trackAllIds.push(e.track_id)
    })
    return trackAllIds;
  }

  async getTrack(id) {
    const track = await Track.findOne({
      where: {
        track_id: id
      }
    });
    return track;
  }

  async getTracksById(trackIdListStr) {
    let ids = trackIdListStr.map(Number)
    const tracks = await Track.findAll({
      where: {
        track_id: {
          [Sequelize.Op.in]: ids
        }
      }
    })
    return tracks
  }

  async getTrackListByQueryParams(params) {
    let whereCondition = this.searchWhereCondition(params)
    let page = parseInt(params.page)
    let count1 = parseInt(params.count)

    const { rows, count } = await Track.findAndCountAll({
      where: whereCondition,
      offset: page * count1,
      limit: count1
    })
    return {
      trackList: rows,
      total: count
    }
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

  async getTotalPlayTime(trackIdListStr) {
    let tracks_duration = []

    let trackIdList = trackIdListStr.map(Number)
    let tracks = await Track.findAll({
      attributes: ['track_duration'],
      where: {
        track_id: {
          [Sequelize.Op.in]: trackIdList
        }
      }
    })

    tracks.forEach((e) => {
      tracks_duration.push(e.track_duration)
    })

    let hour = 0,
      minute = 0,
      second = 0

    tracks_duration.forEach((e) => {
      let tmp = e.split(':')
      if (tmp.length == 2) {
        minute += parseInt(tmp[0])
        second += parseInt(tmp[1])
      } else if (tmp.length == 3) {
        hour += parseInt(tmp[0])
        minute += parseInt(tmp[1])
        second += parseInt(tmp[2])
      }
    })

    minute += parseInt(second / 60)
    second %= 60
    hour += parseInt(minute / 60)
    minute %= 60

    return hour + ':' + minute + ':' + second
  }
}


export { TrackDao };