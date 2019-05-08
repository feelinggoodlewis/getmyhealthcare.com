import { h, Component } from 'preact';
import { Formik } from 'formik';
import { DisplayFormikState } from './helper';
import PageOne from './PageOne';
import PageTwo from './PageTwo';
import PageThree from './PageThree';
import PageFour from './PageFour';
import PageFive from './PageFive';
import Wiz from './Wiz';
import MaskedInput from "react-text-mask";
import Progress from 'preact-progress';
import { SignUpSchema } from './validation';
import Debug from './helper'

const userAgent = navigator.userAgent;
const leadid = document.getElementById('leadid_token').value;

class Wizard extends Component {
  
  state = {
    pageIndex: 0,
    initialValues: {
      numberOnPolicy: '',
      home_zip: '',
      dateOfBirth: '',
      gender: '',
      tobacco: '',
      income: '',
      coverageType: '',
      name_first: '',
      name_last: '',
      home_street: '',
      email: '',
      phone_home: '',
      coverageType: '',
      user_agent: userAgent,
      universal_leadid: leadid,
      trusted_form_url: "",
      ip_address: ""
    }
  };

  componentWillMount () {
    // Checking if we have session storage created
    if(sessionStorage.getItem('getmyhealth')){
      // If storage exists set initial values from storage
      const initialValues = JSON.parse(sessionStorage.getItem('getmyhealth'))
      this.setState({
        initialValues: initialValues
      })
    } else {
      // if storage does not exists set component initial values to storage
      sessionStorage.setItem('getmyhealth', JSON.stringify(this.state.initialValues))
    }
  }
  

  handleSubmit = (values) => {
    // getting aff values
    values.client_name= this.props.affid || 'HealthDefault';
    values.sub_id1= this.props.sub_id1 || 's1';
    values.sub_id2= this.props.sub_id2 || 's2';
    values.sub_id3= this.props.sub_id3 || 's3';

    // hardcoding some values
    // values.user_agent= 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3776.0 Safari/537.36';
    // values.ip_address = '127.0.0.1';
    // values.home_city = 'Beverly Hills';
    // values.home_state = 'CA';
    values.datetime_collected = new Date().toISOString();

    // get date of birth in correct format
    const month = values.dateOfBirth.substr(0, 2);
    const day = values.dateOfBirth.substr(3, 2);
    const year = values.dateOfBirth.substr(6, 4);
    values.dob = year + '-' + month + '-' + day;
    delete values.dateOfBirth;

    let  trusted_form_url_value =  document.getElementById('trusted_form_url_0').value;
    values.trusted_form_url = trusted_form_url_value;
		// values.universal_leadid = leadid.value;

    const data = Object.keys(values).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(values[k])}`).join('&');
    console.log('form data object: ', values);
    console.log('form data query: ', data);

    fetch('https://staging.one.pingtreetech.com/api/health/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: data
    })
    .then((res) => res.json())
    .then((data) => console.log(JSON.stringify(data)));
  }

  render() {
    return (
      <Wiz pages={[PageOne, PageTwo, PageThree, PageFour, PageFive] } testVal={this.state}>
      {wizProps => (
        <Formik
          initialValues={this.state.initialValues}
          validationSchema={SignUpSchema}
          handleChange
          // enableReinitialize
          onSubmit={(values, { setSubmitting }) => {
            // setTimeout(() => {
              this.handleSubmit(values);
              setSubmitting(false);
            // }, 1000);
          }}
        >
          {props => {
            const { handleSubmit } = props;
            return (
              <form onSubmit={handleSubmit}>
                {wizProps.renderPage(props)}
                
              </form>
            );
          }}
        </Formik>
      )}
    </Wiz>
    );
  }

    // _navigateBack = () => {
    //     this.setState(prevState => ({
    //         pageIndex: prevState.pageIndex - 1 < 0 ? prevState.pageIndex - 1 : 0
    //     }));
    // };

    // _navigateNext = () => {
    //   console.log('test')
    //     this.setState(prevState => ({
    //         pageIndex: prevState.pageIndex + 1
    //     }));
    // };

    // _handleLocalStorage = (e) => {
    //   const tempStorage = JSON.parse(sessionStorage.getItem('getmyhealth'))
    //   console.log(e)
    //   console.log(tempStorage);
    // }

    // _renderPage(props) {
    //     const { pageIndex } = this.state;
    //     const pageHash = {
    //         0: PageOne,
    //         1: PageTwo,
    //         2: PageThree,
    //         3: PageFour,
    //         4: PageFive
    //     };

    //     const Page = pageHash[pageIndex];

    //     return (
    //         <Page
    //         {...props}
    //         navigateBack={this._navigateBack}
    //         navigateNext={this._navigateNext}
    //         pageIndex={pageIndex}
    //       />
    //     );
    // }
}

export default Wizard;
