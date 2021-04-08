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
      naming_scheme: "DSC",
      structure: "logo_left",
      colorful: true
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleStructureChange = this.handleStructureChange.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
  }
  handleChange(event) {
    this.setState({ naming_scheme: event.target.value }, () => { this.drawImage(); });
  }

  handleStructureChange(event) {

    this.setState({ structure: event.target.value }, () => { this.drawImage(); });
  }
  handleColorChange(event) {
    this.setState({ colorful: event.target.value === "Colorful" }, () => {
      this.drawImage();
    });
  }
  componentDidMount() {
    WebFont.load({
      google: {
        families: ["Roboto:400", "Product Sans"]
      },
      fontactive: (familyName, fvd) => {
        this.drawImage()
      }
    });
  }

  render() {
    return (
      <div className="main">
        <div>
          <h1>GDSC Lockup Generator</h1>
          <div style={hidden}>
            <img
              ref={e => {
                this.dscLogo = e;
              }}
              onLoad={() => {
                this.drawImage();
              }}
              src={this.state.colorful ? "dsc_icon-01.svg" : "dsc_icon-02.svg"}
              alt={`DSC Icon`}
            />
          </div>
          <p>Start editing to see some magic happen :)</p>
          <div className="controls">
            {this.renderScaleButton()}
            <select defaultValue={this.state.structure} onChange={this.handleStructureChange}>
              <option disabled={true}>Select Style</option>
              <option value="logo_left">Logo Left</option>
              <option value="logo_center">Logo Center</option>
            </select>
            <select defaultValue={this.state.naming_scheme} ref="naming_scheme" onChange={this.handleChange}>
              <option disabled={true}>Select Naming Scheme</option>
              <option value="GDSC">GDSC</option>
              <option value="Google Developer Student Clubs">Google Developer Student Clubs</option>
            </select>
            <select defaultValue={this.state.coloration} onChange={this.handleColorChange}>
              <option disabled={true}>Select Coloration</option>
              <option value="Colorful">Colorful</option>
              <option value="Knockout">Knockout</option>
            </select>
          </div>
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
          <div className={this.state.colorful ? "full-logo-container" : "full-logo-container dark"}>
            <img
              ref={e => {
                this.fullLogoImg = e;
              }}
              alt={`GDSC ${this.state.name} Logo`}
              src={this.state.fullLogoUrl}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            href={this.state.fullLogoUrl}
            download={`GDSC ${this.state.name} Logo x${this.state.scale}.png`}
          >
            SAVE IMAGE
            </Button>
        </div>
        <footer>
          Made with <span role="img" aria-label="love">❤️ </span> by <a href="https://twitter.com/shanggyilim" target="_blank" rel="noopener noreferrer">@shanggyilim</a>, <a href="https://twitter.com/kmicato" target="_blank" rel="noopener noreferrer">@kmicato</a> & <a href="https://github.com/stelioslogothetis" target="_blank" rel="noopener noreferrer">@stelioslogothetis</a>. <a href="https://github.com/shangyilim/dsc-logo-generator">GitHub</a>
        </footer>
      </div>
    );
  }

  drawImage() {
    const name = this.state.name;
    const structure = this.state.structure;
    const naming_scheme = this.state.naming_scheme;
    const colorful = this.state.colorful;
    const scale = this.state.scale;
    const ctx = this.logoCanvas.getContext("2d");
    ctx.font = `94px "Product Sans"`;

    // measures the minimum width of the text to ensure the canvas is expanded at least by this
    // value.
    const minimumTextWidth = naming_scheme === "GDSC" && structure === "logo_left" ? ctx.measureText(naming_scheme + name).width :
      Math.max(ctx.measureText(name).width, ctx.measureText(naming_scheme).width);

    const canvasWidth = (structure === "logo_center" ? minimumTextWidth : minimumTextWidth + this.dscLogo.width) + 100;

    this.logoCanvas.setAttribute("width", canvasWidth * scale);

    if (naming_scheme === "GDSC" && structure !== "logo_center")
      this.logoCanvas.setAttribute("height", this.dscLogo.height * scale);
    else
      this.logoCanvas.setAttribute("height", (this.dscLogo.height * 2 * scale) + 50);

    ctx.scale(scale, scale);
    ctx.font = `94px "Product Sans"`;
    ctx.fillStyle = colorful ? "rgb(103, 108, 114)" : "rgb(255, 255, 255)";
    let imageDX = structure === "logo_center" ? (minimumTextWidth / 2 - (this.dscLogo.width / 2)) : 0;
    ctx.drawImage(this.dscLogo, imageDX, 0, this.dscLogo.width, this.dscLogo.height);

    //if logo center
    if (structure === "logo_center") {
      ctx.fillText(naming_scheme, 0, this.dscLogo.height + 50);
      ctx.fillText(name, 0, (this.dscLogo.height) * 2);
      // this.ref.naming_scheme
    } else {
      //if DSC is selected, draw on one line
      if (naming_scheme === "GDSC") {
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
