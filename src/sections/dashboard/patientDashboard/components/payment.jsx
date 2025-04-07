import React, { useEffect } from 'react';

const RazorpayButton = () => {
    useEffect(() => {
        if (!document.querySelector(`script[src="https://checkout.razorpay.com/v1/payment-button.js"]`)) {
            const script = document.createElement('script');
            script.src = "https://checkout.razorpay.com/v1/payment-button.js";
            script.setAttribute('data-payment_button_id', 'pl_OPNF3Dif5T9gKq');
            script.async = true;

            const form = document.getElementById('razorpay-form');
            form.appendChild(script);
        }
    }, []);

    return (
        <div id="razorpay-button-container">
            <form id="razorpay-form"></form>
        </div>
    );
};

export default RazorpayButton;