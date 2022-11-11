const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapSongDBToModel, mapSongDBToDetailedModel } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService{
  constructor(){
    this._pool = new Pool();
  }

  async addSong({ title, year, performer, genre, duration, albumId }) {
    const id = `song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    
    const query = { 
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $8) RETURNING id', 
      values: [id, title, year, performer, genre, duration, albumId, createdAt], 
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Song gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs(title = '', performer = '') {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE title ILIKE $1 and performer ILIKE $2',
      values: [`%${title}%`, `%${performer}%`],
    };
    const { rows } = await this._pool.query(query);
    return rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount){
      throw new NotFoundError('Song tidak ditemukan');
    }

    return result.rows.map(mapSongDBToDetailedModel)[0];
  }

  async getSongsByAlbumId(albumId) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [albumId],
    };

    const { rows } = await this._pool.query(query);
    return rows;
  }

  async editSongById(id, {
    title, year, performer, genre, duration, albumId
  }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4,duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id',
      values: [title, year, performer, genre, duration, albumId, updatedAt, id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Gagal memperbarui song, id tidak Ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };
 
    const { rowCount } = await this._pool.query(query);
 
    if (!rowCount) {
      throw new NotFoundError('Song gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;