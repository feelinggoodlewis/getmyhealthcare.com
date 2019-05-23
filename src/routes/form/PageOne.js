import { h, Component } from 'preact';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import MaskedInput from 'react-text-mask';
import Progress from 'preact-progress';

const zipMask = [/[0-9]/, /\d/, /\d/, /\d/, /\d/];

const onChange = (ctx, val) => console.log('');

// TODO Make ZipSubmit component
class PageOne extends Component {

    getStateAndCity = async (zip) => {
        let response = fetch(`https://api.zippopotam.us/us/${zip}`, {
                method: 'GET'
            })
            .then((res) => res.json())
            .then((data) => (data.places[0]));

        let data = await response;

        return {
            home_city: data['place name'],
            home_state: data['state abbreviation']
        }
    }

    handleNext = async () => {
        // get localStorage assign to temp const
        const tempStorage = JSON.parse(sessionStorage.getItem('getmyhealth'))

        // get state and city from API
        const stateAndCity = await this.getStateAndCity(tempStorage['home_zip'])
        tempStorage['home_city'] = stateAndCity.home_city;
        tempStorage['home_state'] = stateAndCity.home_state;

        // Set local storage with new values
        sessionStorage.setItem('getmyhealth', JSON.stringify(tempStorage))

        // Set hidden values form API submit
        this.props.setFieldValue('home_city', stateAndCity.home_city)
        this.props.setFieldValue('home_state', stateAndCity.home_state)

        // Navigate to next page
        this.props.navigateNext()

    }

    // check if home_zip exists in errors
    checkForErrors = (errors) => {
        return !errors.hasOwnProperty('home_zip');
    }

    render() {
        // Tests if zip exists
        const isValidZip = async (value) => {
            if (value && value.replace(/[^0-9]/g, "").length === 5) {
                const response = await fetch(`https://api.zippopotam.us/us/${value}`);
                if (response.status !== 200) {
                    return 'Not good zip';
                }
            } else if (value && value.replace(/[^0-9]/g, "").length < 5) {
                return 'Must have 5 digits';
            }
        }

        return (
			<main>
				<div class="mast">
					<h2>Find the right health insurance for you!</h2>
					<div class="mast-image"></div>
					<h3>Get Started!</h3>
					<div class="input-group">
						<label htmlFor="home_zip" name="home_zip">Please Enter Your ZIP Code to Start</label>
						<Field
								name="home_zip"
								validate={isValidZip}
								render={({ field }) => (
									<MaskedInput
										{...field}
										mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/]}
										placeholder="ZIP Code"
										type="text"
										guide={true}
										onChange={ (e) => {
											this.props.handleChange(e);
											this.props.handleLocalStorage(e);
										}}
									/>
								)}
							/>
							<button
								type="button"
								onClick={ this.handleNext }
								disabled={!(this.checkForErrors(this.props.errors) && this.props.values.home_zip)}
							>
								Next
							</button>
							<ErrorMessage
								name="home_zip"
								component="div"
								className="field-error"
							/>
						</div>
					</div>
				<div class="plans">
					<ul>
						<li>
							<img src="/assets/pill-icon.svg" alt="Obamacare Plans" />
							<p>Obamacare Plans</p>
						</li>
						<li>
							<img src="/assets/life-case.svg" alt="Medicare Plans" />
							<p>Short-term Plans</p>
						</li>
						<li>
							<img src="/assets/heart-beat.svg" alt="Medicare Plans" />
							<p>Medicare Plans</p>
						</li>
						<li>
							<img src="/assets/Laptop Icon.svg" alt="Health Plans" />
							<p>Health Plans</p>
						</li>
					</ul>
				</div>
				<div class="about">
				<h3>Everything you need for your health insurance choices in one place!</h3>
				<div class="about-image"></div>
				<div id="how-it-works" class="how-it-works">
					<h4>Guided Online Experience</h4>
					<p>We know not many people are healthcare experts, so we provide explanations, product guides, and advice along the way.</p>
					<h4>Compare Tons of Insurance Plans and Save</h4>
					<p>We work hard to deliver the best health plan shopping experience on the web. And it costs you nothing to use our search.</p>
					<h4>Personalized Recommendations</h4>
					<p>We sort through your options in our database, and point you in the right direction based on your needs, preferences, and budget.</p>
					<div class="input-group">
						<label htmlFor="home_zip" name="home_zip">Please Enter Your ZIP Code to Start</label>
						<Field
							name="home_zip"
							render={({ field }) => (
								<MaskedInput
									{...field}
									mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/]}
									placeholder="ZIP Code"
									type="text"
									guide={true}
									onChange={(e)=>{
										this.props.handleChange(e);
										this.props.handleLocalStorage(e);
									}}
								/>
							)}
						/>
						<button
							type="button"
							onClick={this.handleNext}
							disabled={!(this.checkForErrors(this.props.errors) && this.props.values.home_zip)}
						>
							Next
						</button>
						<ErrorMessage
							name="home_zip"
							component="div"
							className="field-error zip-field-error"
						/>
					</div>
					</div>
					</div>
					<div id="stats" class="stats">
						<p>Over 150,000 people helped this year!</p>
						<p>Get your personalized insureance plans</p>
						<p>3 minutes to get a quote</p>
					</div>
					<div id="tips" class="tips">
						<h3>Your Top Tips for Insurance Shopping</h3>
						<p>Before you purchase a health plan, make sure you also explore all the options available to you. For example, if you are not married, but have a domestic partner, find out if you can get covered under their health plan.</p>
						<p>One thing people often overlook is reviewing how two different health plans can work together. For example, if you are married or have a domestic partner, understanding the coverage on both plans and comparing the advantages in each plan can help you reduce costs.</p>

								<div class="input-group">
							
								<label htmlFor="home_zip" name="home_zip">Please Enter Your ZIP Code to Start</label>
							<Field
												name="home_zip"
												render={({ field }) => (
													<MaskedInput
														{...field}
														mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/]}
														placeholder="ZIP Code"
														type="text"
														guide={true}
														onChange={(e)=>{
															this.props.handleChange(e);
															this.props.handleLocalStorage(e);
														}}
													/>
												)}
											/>
								<button
									type="button"
									onClick={this.handleNext}
									disabled={!(this.checkForErrors(this.props.errors) && this.props.values.home_zip)}
								>
									Next
								</button>
								<ErrorMessage
									name="home_zip"
									component="div"
									className="field-error zip-field-error"
								/>
							</div>
						</div>
					</main>
        );
    }
}
export default PageOne;
