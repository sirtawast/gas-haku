import React, {Component} from 'react';
import axios from 'axios';

import '../App.css';

class MarketItems extends Component {

  constructor() {
    super();
    this.state = {
      items: {},
    }
  }

  fetchItems() {
    axios.get('/results.json').then((res)=>{
      this.setState({items: res.data})
    });
  }

  componentWillMount() {
    this.fetchItems();
  }

  render() {
    const data = this.state.items;

    const marketItems = Object.keys(data).map((key) => {
      return (
        <div class="market-item">
          <span key={key} >{data[key].title}</span>
          <div>
            <a href={data[key].link}>
              <img src={data[key].img} />
            </a>
          </div>
          <input type="button" value="Ei kiinnosta" />
        </div>
      )
    })

    return (
      <div className="market-items">
        {marketItems}
      </div>
    )
  }
}

export default MarketItems;
