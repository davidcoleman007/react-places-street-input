# react-places-street-input

A React component to build a customized UI for Google Maps Places Autocomplete

### Features
1. Enable you to easily build a customized autocomplete dropdown powered by [Google Maps Places Library](https://developers.google.com/maps/documentation/javascript/places)
2. [Utility functions](#utility-functions) to geocode and get latitude and longitude using [Google Maps Geocoder API](https://developers.google.com/maps/documentation/javascript/geocoding)
3. Pass through arbitrary props to the input element to integrate well with other libraries (e.g. Redux-Form)

### Installation
To install the stable version

```sh
yarn add react-places-street-input
```

or

```sh
npm install react-places-street-input --save
```

The React component is exported as a default export

```js
import ReactPlacesStreetInput from 'react-places-street-input'
```

`geocodeByAddress` and `geocodeByPlaceId` utility functions are named exports

```js
import { geocodeByAddress, geocodeByPlaceId } from 'react-places-street-input'
```

To build the example locally, clone this repo and then run:

```sh
npm run demo
```


### Getting Started
<a name="load-google-library"></a>
To use this component, you are going to need to load [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/)

Load the library in your project

```html
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script>
```

Declare your ReactPlacesStreetInput component using React component

```js
import React from 'react'
import ReactPlacesStreetInput, { geocodeByAddress, getLatLng } from 'react-places-street-input'

class SimpleForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { address: 'San Francisco, CA' }
    this.onChange = (address) => this.setState({ address })
  }

  handleFormSubmit = (event) => {
    event.preventDefault()

    geocodeByAddress(this.state.address)
      .then(results => getLatLng(results[0]))
      .then(latLng => console.log('Success', latLng))
      .catch(error => console.error('Error', error))
  }

  render() {
    const inputProps = {
      value: this.state.address,
      onChange: this.onChange,
    }

    return (
      <form onSubmit={this.handleFormSubmit}>
        <ReactPlacesStreetInput inputProps={inputProps} />
        <button type="submit">Submit</button>
      </form>
    )
  }
}

export default SimpleForm
```

### Props for `ReactPlacesStreetInput`

#### Required Props:

* [`inputProps`](#inputProps)

#### Optional Props:

* [`autocompleteItem`](#autocompleteItem)
* [`classNames`](#classNames)
* [`styles`](#styles)
* [`onError`](#onError)
* [`clearItemsOnError`](#clearItemsOnError)
* [`onSelect`](#onSelect)
* [`onEnterKeyDown`](#onEnterKeyDown)
* [`options`](#options)
* [`debounce`](#debounce)
* [`highlightFirstSuggestion`](#highlightFirstSuggestion)
* [`googleLogo`](#googleLogo)
* [`googleLogoType`](#googleLogoType)
* [`enableAutoCompleteWhenNotFocused`](#enable-autocomplete-when-not-focused)
<a name="inputProps"></a>
#### inputProps
Type: `Object`,
Required: `true`

ReactPlacesStreetInput is a [controlled component](https://facebook.github.io/react/docs/forms.html#controlled-components). Therefore, you MUST pass at least `value` and `onChange` callback to the input element.

You can pass arbitrary props to the input element thorough `inputProps` object (NOTE: `className` and `style` props for the input element should be passed through `classNames.input` and `styles.input` respectively).

```js
  const inputProps = {
    value, // `value` is required
    onChange, // `onChange` is required
    onBlur: () => {
      console.log('blur!')
    },
    type: 'search',
    placeholder: 'Search Places...',
    autoFocus: true,
  }
```

<a name="autocompleteItem"></a>
#### autocompleteItem
Type: `Functional React Component`,
Required: `false`

The function takes props with `suggestion`, `formattedSuggestion` keys (see the example below).
We highly recommend that you create your own custom `AutocompleteItem` and pass it as a prop.

```js
/***********************************************
 Example #1
 autocompleteItem example with `suggestion`
************************************************/
render() {
  const AutocompleteItem = ({ suggestion }) => (<div><i className="fa fa-map-marker"/>{suggestion}</div>)

  return (
    <ReactPlacesStreetInput
      inputProps={inputProps}
      autocompleteItem={AutocompleteItem}
    />
  )
}

/***************************************************
 Example #2
 autocompleteItem example with `formattedSuggestion`
****************************************************/
render() {
  const AutocompleteItem = ({ formattedSuggestion }) => (
    <div>
      <strong>{ formattedSuggestion.mainText }</strong>{' '}
      <small>{ formattedSuggestion.secondaryText }</small>
    </div>
  )

  return (
    <ReactPlacesStreetInput
      inputProps={inputProps}
      autocompleteItem={AutocompleteItem}
    />
  )
}
```

<a name="classNames"></a>
#### classNames
Type: `Object`,
Required: `false`

You can give a custom css classes to elements.
Accepted keys are `root`, `input`, `autocompleteContainer`, `autocompleteItem`, `autocompleteItemActive`, `googleLogoContainer`, `googleLogoImage`.
If you pass `classNames` props, none of the default inline styles nor inline styles from `styles` prop will
be applied to the element, and you will have full control over styling via CSS.

```js
// classNames example
render() {
  const cssClasses = {
    root: 'form-group',
    input: 'form-control',
    autocompleteContainer: 'my-autocomplete-container'
  }

  return (
    <ReactPlacesStreetInput
      inputProps={inputProps}
      classNames={cssClasses}
    />
  )
}
```
Now you can easily apply custom CSS styles using the classNames!

<a name="styles"></a>
#### styles
Type `Object`,
Required: `false`

You can provide custom inline styles to elements.
Accepted keys are `root`, `input`, `autocompleteContainer`, `autocompleteItem`, `autocompleteItemActive`, `googleLogoContainer`, `googleLogoImage`.

```js
const defaultStyles = {
  root: {
    position: 'relative',
    paddingBottom: '0px',
  },
  input: {
    display: 'inline-block',
    width: '100%',
    padding: '10px',
  },
  autocompleteContainer: {
    position: 'absolute',
    top: '100%',
    backgroundColor: 'white',
    border: '1px solid #555555',
    width: '100%',
  },
  autocompleteItem: {
    backgroundColor: '#ffffff',
    padding: '10px',
    color: '#555555',
    cursor: 'pointer',
  },
  autocompleteItemActive: {
    backgroundColor: '#fafafa'
  },
  googleLogoContainer: {
    textAlign: 'right',
    padding: '1px',
    backgroundColor: '#fafafa'
  },
  googleLogoImage: {
    width: 150
  }
}
```

Object passed via `styles` prop will be merged in with the above defaults and applied to their respective elements.
NOTE: Passing `classNames` will disable any inline styling for respective elements.

```js
// custom style examples
render() {
  const myStyles = {
    root: { position: 'absolute' },
    input: { width: '100%' },
    autocompleteContainer: { backgroundColor: 'green' },
    autocompleteItem: { color: 'black' },
    autocompleteItemActive: { color: 'blue' }
  }

  return (
    <ReactPlacesStreetInput
      inputProps={inputProps}
      styles={myStyles}
    />
  )
}
```

<a name="onError"></a>
#### onError
Type: `Function`
Required: `false`

You can pass `onError` prop to customize the behavior when [google.maps.places.PlacesServiceStatus](https://developers.google.com/maps/documentation/javascript/places#place_details_responses) is not `OK` (e.g., no predictions are found)

Function takes `status` as a parameter

<a name="clearItemsOnError"></a>
#### clearItemsOnError
Type: `Boolean`
Required: `false`
Default: `false`

You can pass `clearItemsOnError` prop to indicate whether the autocomplete predictions should be cleared when `google.maps.places.PlacesServiceStatus` is not OK

<a name="onSelect"></a>
#### onSelect
Type: `Function`
Required: `false`,
Default: `null`

You can pass a function that gets called instead of `onChange` function when user
hits the Enter key or clicks on an autocomplete item.

The function takes two positional arguments. First argument is `address`, second is `placeId`.

```js
const handleSelect = (address, placeId) => {
  this.setState({ address, placeId })

  // You can do other things with address string or placeId. For example, geocode :)
}

// Pass this function via onSelect prop.
<ReactPlacesStreetInput
  inputProps={inputProps}
  onSelect={this.handleSelect}
/>
```

<a name="onEnterKeyDown"></a>
#### onEnterKeyDown
Type: `Function`
Required: `false`
Deafult: `noop`

You can pass a callback function that gets called when pressing down Enter key when no item in the dropdown is selected.  
The function takes one argument, the value in the input field.

```js
const handleEnter = (address) => {
  geocodeByAddress(address)
    .then(results => {
      console.log('results', results)
    })
}

// Pass this function via onEnterKeyDown prop.
<ReactPlacesStreetInput
  inputProps={inputProps}
  onEnterKeyDown={this.handleEnter}
/>
```

<a name="options"></a>
#### options
Type: `Object`
Required: `false`
Default: `{}`

You can fine-tune the settings passed to the AutocompleteService class with `options` prop.
This prop accepts an object following the same format as [google.maps.places.AutocompletionRequest](https://developers.google.com/maps/documentation/javascript/reference#AutocompletionRequest)
(except for `input`, which comes from the value of the input field).

```js
// these options will bias the autocomplete predictions toward Sydney, Australia with a radius of 2000 meters,
// and limit the results to addresses only
const options = {
  location: new google.maps.LatLng(-34, 151),
  radius: 2000,
  types: ['address']
}

<ReactPlacesStreetInput
  inputProps={inputProps}
  options={options}
/>
```

<a name="debounce"></a>
#### debounce
Type: `Number`
Required: `false`
Default: `200`

The number of milliseconds to delay before making a call to Google API.

<a name="highlightFirstSuggestion"></a>
#### highlightFirstSuggestion
Type: `Boolean`
Required: `false`
Default: `false`

If set to `true`, first suggestion in the dropdown will be automatically highlighted.

<a name="googleLogo"></a>
#### googleLogo
Type: `Boolean`
Required: `false`
Default: `true`

Allows you to toggle the "powered by Google" logo. For more information on Google's logo requirements, refer to this link: [https://developers.google.com/places/web-service/policies](https://developers.google.com/places/web-service/policies)

<a name="googleLogoType"></a>
#### googleLogoType
Type: `String` ("default" or "inverse")
Required: `false`
Default: `"default"`

Allows you to pick right color theme for "powered by Google" logo.
Please see Google's API page for more information: [https://developers.google.com/places/web-service/policies](https://developers.google.com/places/web-service/policies)

<a name="utility-functions"></a>
## Utility Functions
* [`geocodeByAddress`](#geocode-by-address)
* [`geocodeByPlaceId`](#geocode-by-place-id)
* [`getLatLng`](#get-lat-lng)

<a name="geocode-by-address"></a>
### `geocodeByAddress` API

```js
/**
 * Returns a promise
 * @param {String} address
 * @return {Promise}
*/
geocodeByAddress(address)
```

#### address
Type: `String`,
Required: `true`

String that gets passed to Google Maps [Geocoder](https://developers.google.com/maps/documentation/javascript/geocoding)

```js
import { geocodeByAddress } from 'react-places-street-input'

// `results` is an entire payload from Google API.
geocodeByAddress('Los Angeles, CA')
  .then(results => console.log(results))
  .catch(error => console.error(error))
```

<a name="enable-autoomplete-when-not-focused"></a>
### `enableAutoCompleteWhenNotFocused` API

when `true`, the component will have the dom property `autocomplete` set to `on`
when not focused, and `off` then focused.  This allows Google Chrome auto-fill to
fill this component with a predefined value relevant to the value of the 
`inputProp.name` property, such as `name="street"` in a use case where this
places search component is used as an enhanced street input in an address form.

<a name="geocode-by-place-id"></a>
### `geocodeByPlaceId` API

```js
/**
 * Returns a promise
 * @param {String} placeId
 * @return {Promise}
*/
geocodeByPlaceId(placeId)
```

#### placeId
Type: `String`,
Required: `true`

String that gets passed to Google Maps [Geocoder](https://developers.google.com/maps/documentation/javascript/geocoding)


```js
import { geocodeByPlaceId } from 'react-places-street-input'

// `results` is an entire payload from Google API.
geocodeByPlaceId('ChIJE9on3F3HwoAR9AhGJW_fL-I')
  .then(results => console.log(results))
  .catch(error => console.error(error))
```
<a name="get-lat-lng"></a>
### `getLatLng` API

```js
/**
 * Returns a promise
 * @param {Object} result
 * @return {Promise}
*/
getLatLng(result)
```

#### result
Type: `Object`
Required: `true`

One of the element from `results` (returned from Google Maps Geocoder)

```js
import { geocodeByAddress, getLatLng } from 'react-places-street-input'

geocodeByAddress('Tokyo, Japan')
  .then(results => getLatLng(results[0]))
  .then(({ lat, lng }) => console.log('Successfully got latitude and longitude', { lat, lng }))
```

### Discussion

Join us on [Gitter](https://gitter.im/react-places-street-input/Lobby) if you are interested in contributing!

### License

MIT
