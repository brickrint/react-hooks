// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

const useLocalStorageState = (
  key,
  defaultValue,
  {serrialize = JSON.stringify, deserrialize = JSON.parse} = {},
) => {
  const [value, setValue] = React.useState(() => {
    const valueInstorage = window.localStorage.getItem(key)
    if (valueInstorage) {
      return deserrialize(valueInstorage)
    }
    return typeof defaultValue === 'function'
      ? deserrialize(defaultValue())
      : defaultValue
  })

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    if (prevKeyRef.current !== key) {
      window.localStorage.removeItem(prevKeyRef.current)
    }

    prevKeyRef.current = key
    window.localStorage.setItem(key, serrialize(value))
  }, [value, key, serrialize])

  return [value, setValue]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting initialName="RRR" />
}

export default App
