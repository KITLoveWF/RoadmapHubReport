import mail from '#publics/mail.png'
import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import api from '#utils/api.js'
import './VerifyEmail.css'

export default function VerifyEmail() {
    const { email } = useParams();
    const { state } = useLocation();
    const { fullname, password } = state;
    const [resent, setResent] = useState(false)

    const handleResentEmail = () => {
        setResent(true);
        api.post("/accounts/verify-email", { email: email, password: password, fullname: fullname })
    }

    return (
        <div className="verify-email-container">
            <div className="verify-email-card">
                <div className="mail-icon-container">
                    <img src={mail} alt="Email verification" />
                </div>

                <h1 className="verify-email-title">
                    Verifying Email
                </h1>

                <p className="verify-email-description">
                    We have sent an email to <b>{email}</b>. Please click the link to verify your account. This link will expire soon, so please verify promptly!
                </p>

                <div className="verify-info-box">
                    <p>
                        📬 Please make sure to check your spam folder. If you still haven't received the email, it may take a few minutes for the email to arrive.
                    </p>
                </div>

                {!resent ? (
                    <div className="resend-section">
                        <p>
                            Didn't receive the email? {' '}
                            <span className="resend-link" onClick={handleResentEmail}>
                                Resend verification email
                            </span>
                        </p>
                    </div>
                ) : (
                    <div className="success-message">
                        <span className="checkmark-icon">✓</span>
                        <span>Verification email has been resent successfully!</span>
                    </div>
                )}
            </div>
        </div>
    )
}