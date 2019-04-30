import { h } from 'preact';

const Exit = () => (
	<div class="exit">
		<Progress 
		  id="loader" class="loader"
		  value={100} height="3px" color="#6cc644"
		  onChange={onChange} onComplete={onComplete}
		/ >
		<div class="exit-title">
		  <h2>Congratulations!<br />Here are your results</h2>
		</div>
		
		<div class="ad">
		  <div class="top-bar">
		    <p>Featured</p>
		    <p>PPO</p>
		  </div>
		  <img src="static/aetna-logo.png" alt="Aetna Logo" />
		  <p class="description">Bronze 60 HDHO PPO</p>
		  <h5 class="bronze">Bronze</h5>
		  <h4>$282<small>/mo</small></h4>
		  <p class="discounts">Was $383 before subsidies</p>
		  <div class="cost-row">
		    <p>Deductible</p>
		    <p>$6,000</p>
		  </div>
		  <div class="cost-row">
		    <p>Max Out-of-Pocket</p>
		    <p>$6,000</p>
		  </div>
		  <button class="select-button">Select</button>
		  <div class="button-row">
		    <button>Details</button>
		    <button>Compare</button>
		  </div>
		</div>

		<div class="ad">
		  <div class="top-bar">
		    <p>Featured</p>
		    <p>PPO</p>
		  </div>
		  <img src="static/cigna-logo.png" alt="Aetna Logo" />
		  <p class="description">Bronze 60 HDHO PPO</p>
		  <h5 class="bronze">Bronze</h5>
		  <h4>$282<small>/mo</small></h4>
		  <p class="discounts">Was $383 before subsidies</p>
		  <div class="cost-row">
		    <p>Deductible</p>
		    <p>$6,000</p>
		  </div>
		  <div class="cost-row">
		    <p>Max Out-of-Pocket</p>
		    <p>$6,000</p>
		  </div>
		  <button class="select-button">Select</button>
		  <div class="button-row">
		    <button>Details</button>
		    <button>Compare</button>
		  </div>
		</div>
	</div>
);

export default Exit;
