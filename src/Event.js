import React, { Component } from 'react';
import './Event.css';


/* function component: event */
export function Event(props) {
    return (
      <div className="col-lg-4 col-md-4 col-sm-4 col-xs-1">
        <div className="event-block event-blockshadow">
          <h3 className="event-name">{props.item.EventName}</h3>
          <p className="event-venue">
            Venue: {props.item.Venue.Venue}
          </p>
          <p className="event-time">
            Start time: {props.item.AdvertisedStartTime}
          </p>
        </div>
      </div>
    );
}


/* class component: event list */
export class EventList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      initialItems: []
    };
  }

  formatTime(timeStr) {
    timeStr = timeStr.replace('T', ' ');
    timeStr = timeStr.replace('Z', '');
    return timeStr;
  }

  filterList(event) {
    let filteredItems = this.state.initialItems;
    filteredItems = filteredItems.filter(function(item){
      return item.EventName.toLowerCase().search(
        event.target.value.toLowerCase()) !== -1;
    });
    this.setState({items: filteredItems});
  }

  componentDidMount() {
    /* Proxy server is used temporarily to solve the cross origin
     * problem for local server. A better solution is to add my ip 
     * address to AWS whitelist.
     */
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const url = "https://s3-ap-southeast-2.amazonaws.com/";
    const event_api = "bet-easy-code-challenge/next-to-jump";
    
    fetch(proxyUrl + url + event_api)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.result,
            initialItems: result.result
          });
        },
        /* error handling */
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, items } = this.state;

    if (!isLoaded) {
      return <div>Loading...</div>;
    } else if (error) { /* error handling */
      return (
        <div>
          Sorry, there is an error: {error.message}. Please try again later.
        </div>
      );
    } else {
      let cols = [];
      for (let i = 0; i < items.length; i++) {
        items[i].AdvertisedStartTime = 
          this.formatTime(items[i].AdvertisedStartTime);
        cols.push(<Event item={items[i]} key={i} />);
      }
      
      return (
        <div id="event-list">
          <div className="row">
            <form>
              <input type="text" className="form-control" 
                placeholder="Search by event name" onChange={(e) => this.filterList(e)}/>
            </form>
          </div>
          <div className="row">
            {cols}
          </div>
        </div>
      );
    }
  }
}


/* class component: event page */
export default class EventPage extends Component {
  render() {
    return (
      <div className="container">
        <h1 className="event-page-title">Recent Events</h1>
        <EventList />
      </div>
    );
  }
}