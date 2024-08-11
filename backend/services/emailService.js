import dotenv from 'dotenv';
import SibApiV3Sdk from 'sib-api-v3-sdk';

dotenv.config();

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

//what does export do? 
//answer: it allows the function to be imported into another file

export const sendEmail = async (email) => {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const emailToMe = new SibApiV3Sdk.SendSmtpEmail();

    emailToMe.subject = 'Thank you for your submission';
    //send email to Halkhateeb704@gmail.com
    emailToMe.to = [{ email: 'Halkhateeb704@gmail.com' }];
    emailToMe.sender = { email: process.env.EMAIL_USER };
    emailToMe.htmlContent = message;

    try {
        const response = await apiInstance.sendTransacEmail(emailToMe);
        console.log('Email sent successfully:', response);
        return response;
        //what is sendTransacEmail? 
        //answer: it sends an email
    }catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};


