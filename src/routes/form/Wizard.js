import { h, Component } from 'preact';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { DisplayFormikState } from './helper';
import PageOne from './PageOne';
import PageTwo from './PageTwo';
import PageThree from './PageThree';
import PageFour from './PageFour';
import PageFive from './PageFive';
import Wiz from './Wiz';
import MaskedInput from "react-text-mask";
import Progress from 'preact-progress';

const SignUpSchema = Yup.object().shape({
  numberOnPolicy: Yup.mixed()
    .oneOf(['1', '2', '3', '4+'])
    .required('Please select'),
  home_zip: Yup.string()
    .required('Enter ZIP')
    .test('len', 'ZIP is 5 Numbers', val => val && val.replace(/[^0-9]/g, "").length === 5 )
    .test('testing-zip', 'Zip does not exist',
      async val => {
        let tempZip = val.replace(/[^0-9]/g, "");
        if(tempZip && tempZip.length === 5) {
          let response = await fetch(`https://api.zippopotam.us/us/${tempZip}`)
          return !response.ok ? false : true;
        }
      }
    ),
  dateOfBirth: Yup.string()
    .test('date-len', 'Date must be exactly 8 characters', val => val && val.replace(/[^0-9]/g, "").length === 8)
    .required('Required'),
  gender: Yup.mixed()
    .oneOf(['M', 'F'])
    .required('Gender is required'),
  tobacco: Yup.mixed()
    .oneOf(['1', '0'])
    .required('Your tobacco usage is required.'),
  income: Yup.number()
    .required('Your income must be included'),
  coverageType: Yup.mixed()
    .oneOf(['Bronze', 'Silver', 'Gold', 'Platinum'])
    .required('Please select your coverage type.'),
  name_first: Yup.string()
    .required('Required'),
  name_last: Yup.string()
    .required('Required'),
  // Apply mask
  home_street: Yup.string()
    .required('Please enter street address'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Required'),
  phone_home: Yup.string()
    .test('phone-len', 'Phone number must be exactly 8 characters long', val => val && val.replace(/[^0-9]/g, "").length === 10)
    .required('Phone number is required')
});

const userAgent = navigator.userAgent;

class Wizard extends Component {

    state = {
        pageIndex: 0,
        initialValues: {
          numberOnPolicy: '1',
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
          user_agent: userAgent
        }
    };

    componentWillMount () {
      if(sessionStorage.getItem('getmyhealth')){
        const initialValues = JSON.parse(sessionStorage.getItem('getmyhealth'))
        this.setState({
          initialValues: initialValues
        })
      } else {
        sessionStorage.setItem('getmyhealth', JSON.stringify(this.state.initialValues))
      }
    }

    handleSubmit = (values) => {
      values.client_name= this.props.affid || 'HealthDefault';
      values.sub_id1= this.props.sub_id1 || 's1';
      values.sub_id2= this.props.sub_id2 || 's2';
      values.sub_id3= this.props.sub_id3 || 's3';

      values.ip_address = '127.0.0.1';
      values.datetime_collected = new Date().toISOString();

      // get date of birth in correct format
      const month = values.dateOfBirth.substr(0, 2);
      const day = values.dateOfBirth.substr(3, 2);
      const year = values.dateOfBirth.substr(6, 4);
      values.dob = year + '-' + month + '-' + day;
      delete values.dateOfBirth;

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

    _navigateBack = () => {
        this.setState(prevState => ({
            pageIndex: prevState.pageIndex - 1 < 0 ? prevState.pageIndex - 1 : 0
        }));
    };

    _navigateNext = () => {
      console.log('test')
        this.setState(prevState => ({
            pageIndex: prevState.pageIndex + 1
        }));
    };

    _renderPage(props) {
        const { pageIndex } = this.state;
        const pageHash = {
            0: PageOne,
            1: PageTwo,
            2: PageThree,
            3: PageFour,
            4: PageFive
        };

        const Page = pageHash[pageIndex];

        return (
            <Page
            {...props}
            navigateBack={this._navigateBack}
            navigateNext={this._navigateNext}
            // handleLocalStorage={this._handleLocalStorage}
            pageIndex={pageIndex}
          />
        );
    }
}

export default Wizard;
