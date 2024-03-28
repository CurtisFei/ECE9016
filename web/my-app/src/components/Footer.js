import React from "react";
import "./FooterStyles.css";
import axios from "axios";

const Footer = () => (
  <div className="footer">
    
	<div className='container'>
  	 	<div className='row'>
  	 		<div className="footer-col">
  	 			<h4>Meta Music App</h4>
  	 			<ul>
  	 				<li><a href="/HomeContent">about us</a></li>
  	 				
  	 			</ul>
  	 		</div>

  	 		<div className="footer-col">
  	 			<h4>Get Help</h4>
  	 			<ul>
						<li><a >FAQ</a></li>
					</ul>
  	 		</div>
  	 		<div className="footer-col">
  	 			<h4>Contact us</h4>
  	 			<ul>
						<li><a> email and address</a></li>
					</ul>
  	 		</div>
  	 		<div className="footer-col">
  	 			<h4>Documents</h4>
					<ul>
						<li><a href="/TermsAndPolicyContent">Terms and Policy</a></li>
					</ul>
  	 		</div>
  	 	</div>
  	 </div>
  </div>
);

export default Footer;