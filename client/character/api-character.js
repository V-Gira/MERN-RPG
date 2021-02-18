const create = async (params, credentials, character) => {
  try {
    let response = await fetch('/api/character/by/' + params.userId, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + credentials.t,
      },
      body: character,
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

const list = async (signal) => {
  try {
    let response = await fetch('/api/characters/', {
      method: 'GET',
      signal: signal,
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const read = async (params, signal) => {
  try {
    let response = await fetch('/api/characters/' + params.characterId, {
      method: 'GET',
      signal: signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const update = async (params, credentials, character) => {
  try {
    let response = await fetch('/api/characters/' + params.characterId, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + credentials.t,
      },
      body: character,
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const remove = async (params, credentials) => {
  try {
    let response = await fetch('/api/characters/' + params.characterId, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.t,
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const listByUser = async (params, credentials, signal) => {
  try {
    let response = await fetch('/api/characters/by/' + params.userId, {
      method: 'GET',
      signal: signal,
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + credentials.t,
      },
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

export { create, list, read, update, remove, listByUser };
