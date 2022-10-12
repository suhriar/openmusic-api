const mapAlbumDBToModel = ({
  id,
  name,
  year,
}) => ({
  id,
  name,
  year,
});

const mapSongDBToModel = ({
  id,
  title,
  performer,
}) => ({
  id,
  title,
  performer,
});

const mapSongDBToDetailedModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

module.exports = { mapAlbumDBToModel, mapSongDBToModel, mapSongDBToDetailedModel };