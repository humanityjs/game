var React = require('react');
var mui = require('material-ui');
var isEmpty = require('is-object-empty');
var assign = require('object-assign');
var arrayContains = require('array-contains');

var IslandStore = require('../stores/island-store');
var HeroStore = require('../stores/hero-store');
var HeroApi = require('../utils/hero-api');
var mediator = require('../mediator');
var actionTypes = require('../constants/action-types');
var applicationConfig = require('../config/application');

var debug = require('debug')('game:components:island');

var Paper = mui.Paper;
var FontIcon = mui.FontIcon;

function getIslandState() {
  return {
    island: IslandStore.get()
  };
}

function getHeroState() {
  return {
    hero: HeroStore.get()
  };
}

var Island = React.createClass({
  getInitialState: function() {
    return assign({ moveTime: 0 },
      getIslandState(),
      getHeroState()
    );
  },
  componentDidMount: function() {
    IslandStore.addChangeListener(this._onChangeIsland);
    HeroStore.addChangeListener(this._onChangeHero);
  },
  componentWillUnmount: function() {
    IslandStore.removeChangeListener(this._onChangeIsland);
    HeroStore.removeChangeListener(this._onChangeHero);

    window.clearInterval(this._moveInterval);
  },
  _onChangeIsland: function() {
    this.setState(getIslandState());
  },
  _onChangeHero: function() {
    this.setState(getHeroState());
  },
  render: function() {
    var state = this.state;
    if (isEmpty(state.island) || isEmpty(state.hero)) return null;

    var island = state.island;
    var hero = state.hero;
    var location = hero.location;

    // TODO Think about where to get image dimensions on client or backend
    var islandDimensions = {
      width: 1980,
      height: 1280
    };
    var mapDimensions = {
      width: 960,
      height: 480
    };

    var heroPosition = {
      left: location.coordinateX * 20,
      top: location.coordinateY * 20
    };
    var mapMargin = {
      left: heroPosition.left - mapDimensions.width / 2,
      top: heroPosition.top - mapDimensions.height / 2
    };

    if (mapMargin.left < 0) {
      mapMargin.left = 0;
    } else if (islandDimensions.width - mapMargin.left < mapDimensions.width) {
      mapMargin.left -=
        mapDimensions.width - (islandDimensions.width - mapMargin.left);
    }

    if (mapMargin.top < 0) {
      mapMargin.top = 0;
    } else if (islandDimensions.height - mapMargin.top < mapDimensions.height) {
      mapMargin.top -=
        mapDimensions.height - (islandDimensions.height - mapMargin.top);
    }

    var style = {
      overflow: 'hidden',
      height: mapDimensions.height,
      width: mapDimensions.width
    };

    var mapStyle = {
      marginTop: -mapMargin.top,
      marginLeft: -mapMargin.left
    };
    var mapOffset = {
      top: mapMargin.top / 20,
      left: mapMargin.left / 20
    };

    var handlerStyle = {
      position: 'absolute',
      top: heroPosition.top - mapMargin.top - 10,
      left: heroPosition.left - mapMargin.left - 2
    };

    var infoStyle = {
      position: 'absolute',
      width: 150,
      height: 80,
      top: 10,
      left: '50%',
      transform: 'translate(-50%, 0%)',
      zIndex: 9,
      textAlign: 'center'
    };

    var squares = [];
    for(var i = 0; i < mapDimensions.width / 20; i++) {
      for(var j = 0; j < mapDimensions.height / 20; j++) {
        var x = (i + mapOffset.left);
        var y = (j + mapOffset.top);
        var coordX = location.coordinateX;
        var coordY = location.coordinateY;

        var handled = (
          coordX - x === -1 && coordY - y === -1 ||
          coordX - x === 0 && coordY - y === -1 ||
          coordX - x === 1 && coordY - y === -1 ||

          coordX - x === -1 && coordY - y === 1 ||
          coordX - x === 0 && coordY - y === 1 ||
          coordX - x === 1 && coordY - y === 1 ||

          coordX - x === -1 && coordY - y === 0 ||
          coordX - x === 1 && coordY - y === 0);

        squares.push(
          <div
            key={i + '-' + j}
            style={{
              background: (handled) ? 'white' :
                ((arrayContains(island.disabledCoordinates, [x, y])) ? 'red' : ''),
              cursor: (handled) ? 'pointer' : '',
              opacity: '.2',
              position: 'absolute',
              top: j * 20,
              left: i * 20,
              width: 20,
              height: 20
            }}
            onClick={(handled) ? this._onMove.bind(null, x, y) : function(e) {
              var style = e.target.style;
              style.background = (style.background === 'red') ? '' : 'red';
            }}
            title={'x: ' + x + ' y: ' + y} />
        );
      }
    }

    // Getting disabled squares
    // window.coords = []; Array.prototype.forEach.call(document.querySelectorAll("*[style]"), function(elm) {if (elm.style.background === 'red') coords.push([ parseInt(elm.title.split(' ')[1]), parseInt(elm.title.split(' ')[3]) ]); }); JSON.stringify(window.coords);

    debug('render');

    return (
      <div>
        <Paper
          style={infoStyle}
          zDepth={2}>
          <p>
            Position: {location.coordinateX}:{location.coordinateY}
          </p>
          {this.state.moveTime ?
            <p>
              Moving: {this.state.moveTime}
              {' '}
              <a href="" onClick={this._onCancelMove}>Cancel</a>
            </p> : null}
        </Paper>
        <Paper
          rounded={false}
          zDepth={2}
          style={style}>
          <div>
            <img
              style={mapStyle}
              src={island.image}
              alt="" />
            {squares}
          </div>
          <FontIcon
            style={handlerStyle}
            className="mdfi_communication_location_on" />
        </Paper>
      </div>
    );
  },
  _onMove: function(x, y) {
    if (arrayContains(this.state.island.disabledCoordinates, [x, y])) {
      mediator.emit(actionTypes.MESSAGE, 'You can\'t move there');
      return;
    }

    var counter = applicationConfig.islandMoveTime;

    this.setState({
      moveTime: counter
    });

    this._moveInterval = window.setInterval(function() {
      counter--;

      this.setState({
        moveTime: counter
      });

      if (counter === 0) {
        window.clearInterval(this._moveInterval);
        HeroApi.moveOnIsland(x, y);
      }
    }.bind(this) , 1000);
  },
  _onCancelMove: function(e) {
    e.preventDefault();

    window.clearInterval(this._moveInterval);
    this.setState({
      moveTime: 0
    });
  }
});

module.exports = Island;