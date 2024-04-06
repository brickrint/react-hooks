// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {PokemonForm, fetchPokemon, PokemonDataView, PokemonInfoFallback, PokemonErrorBoundary} from '../pokemon'
import { ErrorBoundary } from 'react-error-boundary'

function PokemonInfo({pokemonName}) {
  const [{ status, pokemon, error }, setState] = React.useState({
    pokemon: null,
    error: null,
    status: 'idle'
  });

  React.useEffect(() => {
    if (!pokemonName) return

    setState((s) => ({
      ...s,
      pokemon: null,
      status: 'pending'
    }));
    fetchPokemon(pokemonName).then((newPokemon) => {
      setState((s) => ({
        ...s,
        pokemon: newPokemon,
        status: 'resolved'
      }));
    }).catch((e) => {
      console.log(e)
      setState({
        pokemon: null,
        status: 'rejected',
        error: e ?? {message: 'something went wrong'}
      });
    })
  }, [pokemonName])

  if (status === 'idle') {
  return <div>Submit a pokemon</div>
  }

  if (status === 'rejected') {
    throw error
  }

  if (status === 'pending' || (status === 'resolved' && !pokemon)) {
    return <PokemonInfoFallback name={pokemonName} />
  }

  return <PokemonDataView pokemon={pokemon} />
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={() => setPokemonName('')} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

export default App
