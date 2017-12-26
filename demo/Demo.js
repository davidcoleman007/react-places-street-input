import React from 'react'
import ReactPlacesStreetInput, { geocodeByAddress, getLatLng } from '../src'

class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      address: '',
      geocodeResults: null,
      loading: false
    }
    this.handleSelect = this.handleSelect.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.renderGeocodeFailure = this.renderGeocodeFailure.bind(this)
    this.renderGeocodeSuccess = this.renderGeocodeSuccess.bind(this)
  }

  handleSelect(address) {
    this.setState({
      address,
      loading: true
    })

    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        console.log('Success Yay', { lat, lng })
        this.setState({
          geocodeResults: this.renderGeocodeSuccess(lat, lng),
          loading: false
        })
      })
      .catch((error) => {
        console.log('Oh no!', error)
        this.setState({
          geocodeResults: this.renderGeocodeFailure(error),
          loading: false
        })
      })

    /* NOTE: Using callback (Deprecated version) */
    // geocodeByAddress(address,  (err, { lat, lng }) => {
    //   if (err) {
    //     console.log('Oh no!', err)
    //     this.setState({
    //       geocodeResults: this.renderGeocodeFailure(err),
    //       loading: false
    //     })
    //   }
    //   console.log(`Yay! got latitude and longitude for ${address}`, { lat, lng })
    //   this.setState({
    //     geocodeResults: this.renderGeocodeSuccess(lat, lng),
    //     loading: false
    //   })
    // })
  }

  handleChange(address) {
    this.setState({
      address,
      geocodeResults: null
    })
  }

  renderGeocodeFailure(err) {
    return (
      <div className="alert alert-danger" role="alert">
        <strong>Error!</strong> {err}
      </div>
    )
  }

  renderGeocodeSuccess(lat, lng) {
    return (
      <div className="alert alert-success" role="alert">
        <strong>Success!</strong> Geocoder found latitude and longitude: <strong>{lat}, {lng}</strong>
      </div>
    )
  }

  render() {
    const cssClasses = {
      root: 'form-group',
      input: 'Demo__search-input',
      autocompleteContainer: 'Demo__autocomplete-container',
    }

    const AutocompleteItem = ({ formattedSuggestion }) => (
      <div className="Demo__suggestion-item">
        <i className='fa fa-map-marker Demo__suggestion-icon'/>
        <strong>{formattedSuggestion.mainText}</strong>{' '}
        <small className="text-muted">{formattedSuggestion.secondaryText}</small>
      </div>)

    const inputProps = {
      type: "text",
      value: this.state.address,
      onChange: this.handleChange,
      onBlur: () => { console.log('Blur event!'); },
      onFocus: () => { console.log('Focused!'); },
      autoFocus: true,
      placeholder: "Search Places",
      name: 'ship-address',
      id: "frmAddressS",
    }

    return (
      <div className='page-wrapper'>
        <div className='container'>
          <h1 className='display-3'>react-places-street-input <i className='fa fa-map-marker header'/></h1>
          <p className='lead'>A React component to build a customized UI for Google Maps Places Autocomplete</p>
          <hr />
          <a href='https://github.com/davidcoleman007/react-places-street-input' className='Demo__github-link' target="_blank" >
            <span className='fa fa-github Demo__github-icon'></span>
            &nbsp;View on GitHub
          </a>
        </div>
        <div className='container'>
          <form>
            <legend>Contact Info</legend>
            <label for="frmNameA">Name</label>
            <input name="name" id="frmNameA" placeholder="Full name" required autocomplete="name"/>
            <label for="frmEmailA">Email</label>
            <input type="email" name="email" id="frmEmailA" placeholder="name@example.com" required autocomplete="email"/>
            <label for="frmEmailC">Confirm Email</label>
            <input type="email" name="emailC" id="frmEmailC" placeholder="name@example.com" required autocomplete="email"/>
            <label for="frmPhoneNumA">Phone</label>
            <input type="tel" name="phone" id="frmPhoneNumA" placeholder="+1-650-450-1212" required autocomplete="tel"/>

            Enter Address:
            <fieldset>
              <legend>Shipping</legend>
              <label for="frmAddressS">Address</label>
              <ReactPlacesStreetInput
                onSelect={this.handleSelect}
                autocompleteItem={AutocompleteItem}
                onEnterKeyDown={this.handleSelect}
                classNames={cssClasses}
                inputProps={inputProps}
                enableAutofillWhenNotFocused
              />
              <label for="frmCityS">City</label>
              <input name="ship-city" required="" id="frmCityS" placeholder="New York" autocomplete="shipping address-level2"/>
              <label for="frmStateS">State</label>
              <input name="ship-state" required="" id="frmStateS" placeholder="NY" autocomplete="shipping address-level1"/>
              <label for="frmZipS">Zip</label>
              <input name="ship-zip" required="" id="frmZipS" placeholder="10011" autocomplete="shipping postal-code"/>
              <label for="frmCountryS">Country</label>
              <input name="ship-country" required="" id="frmCountryS" placeholder="USA" autocomplete="shipping country"/>

            </fieldset>
            {this.state.loading ? <div><i className="fa fa-spinner fa-pulse fa-3x fa-fw Demo__spinner" /></div> : null}
            {!this.state.loading && this.state.geocodeResults ?
              <div className='geocoding-results'>{this.state.geocodeResults}</div> :
            null}
          </form>
        </div>
      </div>
    )
  }
}

export default Demo
