import React, { Component } from "react";
import { render } from "react-dom";
import WebFont from "webfontloader";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import "./style.css";

class App extends Component {
  constructor() {
    super();
    this.ref = React.createRef();
    this.state = {
      scale: 1,
      name: "",
      naming_scheme: "",
      structure: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleStructureChange = this.handleStructureChange.bind(this);
  }
  handleChange(event) {
    this.setState({naming_scheme: event.target.value}, () => {this.drawImage();});
  }

  handleStructureChange(event) {

    this.setState({structure: event.target.value}, () => {this.drawImage();});
  }
  componentDidMount(){
    WebFont.load({
      google: {
        families: ["Roboto:400","Product Sans"]
      },
      fontactive: (familyName, fvd)=>{
        this.drawImage()
      }
    });
  }
  
  render() {
    return (
      <div className="main">
          <div>
            <h1>DSC Lockup Generator</h1>
            <div style={hidden}>
              <img
                ref={e => {
                  this.dscLogo = e;
                }}
                onLoad={() => {
                  this.drawImage();
                }}
                src="dsc_icon-01.svg"
                alt={`DSC Icon`}
              />
            </div>
            <p>Start editing to see some magic happen :)</p>
            {this.renderScaleButton()}
            <br></br>
            <select defaultValue={'Select Style'} onChange={this.handleStructureChange}>
                <option disabled={true}>Select Style</option>
                <option value="logo_right">Logo Right</option>
                <option value="logo_center">Logo Center</option>
            </select>
            <br></br>
            <select defaultValue={'Select Naming Scheme'} ref="naming_scheme" onChange={this.handleChange}>
                <option disabled={true}>Select Naming Scheme</option>
                <option value="DSC">DSC</option>
                <option value="Developer Student Clubs">Developer Student Clubs</option>
            </select>
            <br></br>
            <TextField
              label="University"
              margin="normal"
              onChange={e => {
                this.setState(
                  {
                    name: e.target.value
                  },
                  () => {
                    this.drawImage();
                  }
                );
              }}
            />
            <br />
            <canvas
              style={hidden}
              ref={e => {
                this.logoCanvas = e;
              }}
            ></canvas>
            <div className="full-logo-container">
              <img
                ref={e => {
                  this.fullLogoImg = e;
                }}
                alt={`DSC ${this.state.name} Logo`}
                src={this.state.fullLogoUrl}
              />
            </div>
            <Button
              variant="contained"
              color="primary"
              href={this.state.fullLogoUrl}
              download={`DSC ${this.state.name} Logo x${this.state.scale}.png`}
            >
              SAVE IMAGE
            </Button>
          </div>
          <footer>
              Made with <span role="img" aria-label="love">❤️ </span> by <a href="https://twitter.com/shanggyilim" target="_blank"  rel="noopener noreferrer">@shanggyilim</a> & <a href="https://twitter.com/kmicato" target="_blank"  rel="noopener noreferrer">@kmicato</a>. <a href="https://github.com/shangyilim/dsc-logo-generator">GitHub</a>
            </footer>
      </div>
    );
  }

  drawImage() {
    const name = this.state.name;
    const structure = this.state.structure;
    const naming_scheme = this.state.naming_scheme;
    const scale = this.state.scale;
    const ctx = this.logoCanvas.getContext("2d");
    ctx.font = `54px "Product Sans"`;

    const canvasWidth = ctx.measureText("Developer Student Clubs " + name).width + this.dscLogo.width + 500;
    this.logoCanvas.setAttribute("width", canvasWidth * scale);

    if (naming_scheme === "DSC")
        this.logoCanvas.setAttribute("height", this.dscLogo.height * scale);
    else
        this.logoCanvas.setAttribute("height", (this.dscLogo.height * 2 * scale) + 50);

    ctx.scale(scale, scale);
    ctx.font = `94px "Product Sans"`;
    ctx.fillStyle = "rgba(0, 0, 0, 0.54)";
    let imageDX = (structure === "logo_right" || structure === "")? 0 : (ctx.measureText("Developer Student Clubs ").width + this.dscLogo.width)/2;
    ctx.drawImage(this.dscLogo, imageDX, 0, this.dscLogo.width, this.dscLogo.height);

    //if logo center
      if(structure === "logo_center") {
            ctx.fillText(naming_scheme, this.dscLogo.width + 40, this.dscLogo.height + 50);
            ctx.fillText(name, this.dscLogo.width + 40, (this.dscLogo.height) * 2);
            // this.ref.naming_scheme
      } else {
           //if DSC is selected, draw on one line
            if(naming_scheme === "DSC") {
                ctx.fillText(naming_scheme + " " + name, this.dscLogo.width + 40, 110);
            } else {
                ctx.fillText(naming_scheme, this.dscLogo.width + 40, 110);
                ctx.fillText(name, this.dscLogo.width + 40, 200);
            }
      }


    this.setState({
      fullLogoUrl: this.logoCanvas.toDataURL()
    });
  }

  renderScaleButton() {
    return (
      <div className="scale-button">
        <button
          onClick={() => 
            this.setState(
              {
                scale:
                  this.state.scale > 1 ? this.state.scale - 1 : this.state.scale
              },
              () => {
                this.drawImage();
              }
            )
          }
        >
          -
        </button>
        <span>Scale</span>
        <button
          onClick={() => 
            this.setState(
              {
                scale:
                  this.state.scale < 5 ? this.state.scale + 1 : this.state.scale
              },
              () => {
                this.drawImage();
              }
            )
          }
        >
          +
        </button>
      </div>
    );
  }
}

const hidden = {
  display: "none"
};

render(<App />, document.getElementById("root"));
