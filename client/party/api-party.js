const create = async (params, credentials) => {
    try {
        let response = await fetch('/api/party/new/'+params.gameId, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + credentials.t
          }
        })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  const listEnrolled = async (credentials, signal) => {
    try {
      let response = await fetch('/api/party/enrolled', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + credentials.t
        },
        signal: signal,
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }

  const partyStats = async (params, credentials, signal) => {
    try {
      let response = await fetch('/api/party/stats/'+params.gameId, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + credentials.t
        },
        signal: signal,
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  const read = async (params, credentials, signal) => {
    try {
      let response = await fetch('/api/party/' + params.partyId, {
        method: 'GET',
        signal: signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        }
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  const complete = async (params, credentials, party) => {
    try {
      let response = await fetch('/api/party/complete/' + params.partyId, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify(party)
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  const remove = async (params, credentials) => {
    try {
      let response = await fetch('/api/party/' + params.partyId, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        }
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  export {
    create,
    read,
    complete,
    remove,
    listEnrolled,
    partyStats
  }