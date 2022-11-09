const autoBind = require('auto-bind');
const ClientError = require('../../exceptions/ClientError');

class PlaylistsHandler {
  constructor(
    playlistsService, 
    songsService, 
    validator,
  ) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._playlistsService.addPlaylist({
      name,
      owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._playlistsService.getPlaylists(credentialId);
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler(request, h) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(
      playlistId,
      credentialId
    );
    await this._playlistsService.deletePlaylistById(playlistId);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validatePostSongPayload(request.payload);
    const { playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._songsService.getSongById(songId);

    await this._playlistsService.addSongToPlaylist(playlistId, songId);

    // add activity "add" to playlistActivity
    const action = 'add';
    await this._playlistsService.addActivityToPlaylist(
      playlistId,
      songId,
      credentialId,
      action
    );

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);
    return response;
  }

  async getSongsByPlaylistHandler(request, h) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(
      playlistId,
      credentialId
    );

    const playlist = await this._playlistsService.getSongsByPlaylist(playlistId);
    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deleteSongByPlaylistIdHandler(request, h) {
    const { playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(
      playlistId,
      credentialId
    );
    await this._playlistsService.deleteSongByPlaylist(playlistId, songId);

    // add activity "delete" to playlistActivity
    const action = 'delete';
    await this._playlistsService.addActivityToPlaylist(
      playlistId,
      songId,
      credentialId,
      action
    );

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }

  async getPlaylistActivitiesHandler(request, h) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(
      playlistId,
      credentialId
    );

    const activities = await this._playlistsService.getActivitiesByPlaylist(
      playlistId
    );
    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    };
  }
}

module.exports = PlaylistsHandler;