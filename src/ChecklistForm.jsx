const React = require("react");

//const scenegraph = require("scenegraph");
//const application = require("application");
//const uxp = require("uxp");
const fs = require("uxp").storage.localFileSystem;
const Checkbox  = require("./components/Checkbox.jsx");

const CHECKLISTOPTIONS = [
  ["Clear add to cart button",10],
  ["Testimonials / Reviews",10],
  ["Trust Icons",10],
  ["Show low shipping costs",10],
  ["Add guest checkout option",10],
  ["Keep required information to a minimum",10],
  ["Minimal Distractions",10],
  ["Increase number of payment options",10],
  ["Reduce spammy looking sale tactics",10],
];

class ChecklistForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      checkboxes: CHECKLISTOPTIONS.reduce(
        (options, option) => ({
          ...options,
          [option[0]]: false
        }),
        {}
      ),
      score: 0,
    };

    this.onDoneClick = this.onDoneClick.bind(this);

    this.selectAllCheckboxes = (isSelected) => {
      Object.keys(this.state.checkboxes).forEach(checkbox => {
        this.setState(prevState => ({
          checkboxes: {
            ...prevState.checkboxes,
            [checkbox]: isSelected
          }
        }));
      });
    };

    this.selectAll = () => this.selectAllCheckboxes(true);

    this.deselectAll = () => this.selectAllCheckboxes(false);

    this.handleCheckboxChange = (changeEvent) => {
      const name = changeEvent.target.name;
      const checked = changeEvent.target.checked;
      const value = changeEvent.target.value;
      const id = changeEvent.target.id;
      let score = this.state.score;

      if(checked) {
        score = parseInt(score) + parseInt(value);
      } else {
        score = parseInt(score) - parseInt(value);
      }
      
      this.setState(prevState => ({
        checkboxes: {
          ...prevState.checkboxes,
          [name]: !prevState.checkboxes[name]
        },
        score: score,
      }));
    };

    this.createCheckboxes = () => CHECKLISTOPTIONS.map(
      (option,index) => {
        return(
          <Checkbox
            label={option[0]}
            isSelected={this.state.checkboxes[option[0]]}
            onCheckboxChange={this.handleCheckboxChange}
            score={option[1]}
            key={index}
            checkboxId={index}
          />
        )
      }
    );

    this.calculateScore = () => {
      let currentCheckboxes = this.state.checkboxes;

      console.log(currentCheckboxes);
    }
  }

  async onDoneClick() {
    let dataFolder = await fs.getDataFolder();

    try {
      const file = await dataFolder.createEntry("checklist.json", {overwrite: true});

      if (file.isFile) {
        file.write(JSON.stringify(this.state), {append: false});
      }
    } catch(error) {
      console.log(error);
    }
    
    props.dialog.close();
  }

  async componentWillMount() {
    let dataFolder = await fs.getDataFolder();

    try {
      const file = await dataFolder.getEntry('checklist.json');

      if (file) {
        const contents = await file.read();

        this.setState(prevState => (JSON.parse(contents)));
      } else {
        //throw new Error('Error loading checklist.json');
      }
    } catch(error) {
      //console.log(error);

      try {
        const newFile = await dataFolder.createEntry("checklist.json", {overwrite: true});

        if (newFile.isFile) {
          newFile.write(JSON.stringify(this.state), {append: false});
            
          return newFile;
        } else {
          //throw new Error('Error loading checklist.json');
        }
      
      } catch(error) {
        //console.log(error);
      }
    }
  }

  render() {
    return (
      <form style={{width: "300px"}} onSubmit={this.onDoneClick}>
        <header>
          <h1>
            Conversion Checklist
          </h1>
        </header>

        <hr />

        <h2 className="row" style={{alignItems: "center"}}>Score:&nbsp;{this.state.score}</h2>
        <p>Check off items from the list that are included in your prototype to see your current conversion score.</p>

        <div>
          {this.createCheckboxes()}
        </div>

        <footer>
          <button type="submit" uxp-variant="cta">Close</button>
        </footer>
      </form>
    );
  }
}

module.exports = ChecklistForm;