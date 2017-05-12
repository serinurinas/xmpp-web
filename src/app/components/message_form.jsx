let React   = require('react');
let Actions = require('../actions');
let mui     = require('material-ui');
let utils   = require('../utils');

let IconButton = mui.IconButton;
let FontIcon   = mui.FontIcon;
let Colors     = mui.Styles.Colors;
let FileInput = require('react-file-input');



let MessageForm = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  handleChange1: function(event) {
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    let jid = this.props.jid;
    reader.onload = function () {
      Actions.sendMessage(jid, reader.result, 'text');
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  },

  getInitialState () {
    return {
      body: 'HELLO',
    };
  },


  componentDidMount () {
    this.typing      = false;
    this.idleSeconds = 0;

    this.everySecond = setInterval(function () {
      let newIdleSeconds = this.idleSeconds + 1;
      let newTyping      = this.typing;

      if (newTyping && newIdleSeconds > 4) {
        newTyping = false;
        Actions.sendStateChange(this.props.jid, 'active');
      }

      this.idleSeconds = newIdleSeconds;
      this.typing      = newTyping;
    }.bind(this), 1000);
      this._commitMessage();
  },

  componentWillUnmount () {
    clearInterval(this.everySecond);
  },

  handleChange (e) {
    this.setState({
      body: e.target.value,
    });
  },

  handleKeyUp (e) {
    if (e.keyCode === 13) {
      this._commitMessage();
    } else {
      let newTyping = this.typing;
      let newIdleSeconds;

      if (!newTyping) {
        newTyping = true;
        Actions.sendStateChange(this.props.jid, 'composing');
        Actions.resetUnreadCounter(this.props.jid);
      }

      newIdleSeconds = 0;

      this.idleSeconds = newIdleSeconds;
      this.typing      = newTyping;
    }
  },

  handleClick (e) {
    this._commitMessage();
  },

  handleBodyClick (e) {
    Actions.resetUnreadCounter(this.props.jid);
  },

  _commitMessage () {
    if (this.state.body.length === 0) {
      return;
    }

    Actions.sendMessage(this.props.jid, this.state.body, 'text');

    this.setState({
      body: '',
    });
  },




  render () {
    return (
      <div className="message-form form-compact">
        <input type="text" value={this.state.body} placeholder={'HELLO'} onChange={this.handleChange} onKeyUp={this.handleKeyUp} onClick={this.handleBodyClick} />

        <IconButton iconStyle={{fontSize: '18px'}} style={{width: '42px', height: '42px'}} onClick={this.handleClick}>
          <FontIcon className="material-icons" color={Colors.green500}>send</FontIcon>
        </IconButton>
          <form>
              <FileInput name="myImage"
                         accept=".png,.gif"
                         placeholder="Upload Image"
                         className="inputClass"
                         onChange={this.handleChange1} />
          </form>
      </div>
    );
  },

});

module.exports = MessageForm;
