import { NotFound, Forbidden } from 'lin-mizar';
import { Playlist } from "../model/playlist";
import Sequelize, { where } from 'sequelize';
import { TrackDao } from "./track";

class PlaylistDao {
  async createPlaylist(playlist_name, creator, status, description) {
    const playlistsByCreator = await Playlist.findAll({
      where: {
        creator
      }
    })

    if (playlistsByCreator && playlistsByCreator.length >= 20) {
      throw new Forbidden({
        code: 10277
      });
    }

    const playlist = await Playlist.findOne({
      where: {
        name: playlist_name,
        creator
      }
    });
    if (playlist) {
      throw new Forbidden({
        code: 10270
      });
    }
    const pl = new Playlist();
    pl.name = playlist_name
    pl.creator = creator
    pl.description = description
    if (status != null) {
      pl.status = status
    }
    await pl.save();
  }

  async getPlaylistByIds(ids) {
    const playlists = await Playlist.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: ids
        }
      }
    })
    return playlists
  }

  async getPlaylistIdsByCreator(creator) {
    const playlistsIds = await Playlist.findAll({
      attributes: ['id'],
      where: {
        creator
      }
    })
    return playlistsIds
  }

  async updatePlaylist(playlists) {
    for (const playlist of playlists) {
      await playlist.save()
    }
  }

  async updateTracksByName(playlist_name, tracks, creator) {
    const trackDto = new TrackDao();
    const playlist = await Playlist.findOne({
      where: {
        name: playlist_name
      }
    });
    if (!playlist) {
      throw new Forbidden({
        code: 10271
      });
    }
    if (playlist.creator != creator) {
      throw new Forbidden({
        code: 10274
      });
    }
    playlist.track_list = tracks
    playlist.track_number = tracks.split(',').length
    playlist.total_playtime = await trackDto.getTotalPlayTime(tracks.split(','))

    await playlist.save();
  }

  async updatePlaylistByid(body) {
    const playlist = await Playlist.findByPk(body.id);
    if (!playlist) {
      throw new NotFound({
        code: 10271
      });
    }

    if (body.name) {
      playlist.name = body.name
    }
    if (body.description) {
      playlist.description = body.description
    }
    if (body.track_list) {
      playlist.track_list = body.track_list
    }
    if (body.status) {
      playlist.status = body.status
    }
    await playlist.save();
  }

  async getTrackIdsByName(playlist_name, creator) {
    const playlist = await Playlist.findOne({
      where: {
        name: playlist_name
      }
    });

    if (playlist.status == 0 && playlist.creator != creator) {
      return '';
    }
    return playlist.track_list
  }

  async getPlaylistTrackNumberByQueryParams(params) {
    let page = parseInt(params.page)
    let count1 = parseInt(params.count)

    const { rows, count } = await Playlist.findAndCountAll({
      attributes: ['id', 'name', 'description', 'track_list', 'track_number', 'total_playtime', 'creator'],
      where: {
        status: 1
      },
      order: [['update_time', 'DESC']],
      offset: page * count1,
      limit: count1
    })
    return {
      playlists: rows,
      total: count
    }
  }

  async getPlaylistTrackNumberByQueryParamsAndCreator(params, creator) {
    let page = parseInt(params.page)
    let count1 = parseInt(params.count)

    const { rows, count } = await Playlist.findAndCountAll({
      attributes: ['id', 'name', 'description', 'track_list', 'track_number', 'total_playtime', 'creator'],
      where: {
        creator
      },
      order: [['status', 'DESC'], ['update_time', 'DESC']],
      offset: page * count1,
      limit: count1
    })
    return {
      playlists: rows,
      total: count
    }
  }

  async getPlaylistIdsByName(playlistName) {
    const playlistIds = await Playlist.findAll({
      attributes: ['id'],
      where: {
        name: {
          [Sequelize.Op.substring]: playlistName
        }
      }
    })
    return playlistIds
  }

  async deletePlaylistByName(name, creator) {
    const playlist = await Playlist.findOne({
      where: {
        name
      }
    });
    if (!playlist) {
      throw new NotFound({
        code: 10271
      });
    }
    if (playlist.creator != creator) {
      throw new Forbidden({
        code: 10278
      });
    }
    playlist.destroy();
  }
}

export { PlaylistDao };