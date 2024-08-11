import dotenv from 'dotenv';
import SibApiV3Sdk from 'sib-api-v3-sdk';
import fs from 'fs';
import path from 'path';

dotenv.config();

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

//what does export do? 
//answer: it allows the function to be imported into another file

export const sendEmail = async (message, email, filePath) => {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const emailToMe = new SibApiV3Sdk.SendSmtpEmail();

    emailToMe.subject = 'New Submission';
    //send email to Halkhateeb704@gmail.com
    emailToMe.to = [{ email: 'Halkhateeb704@gmail.com' }];
    emailToMe.sender = { email: process.env.EMAIL_USER };
    //htmlContent should be the a message and the users email
    emailToMe.htmlContent = `<html><body>
        <p>${message}</p>
        <p>Email: ${email}</p>
    </body></html>`;

    // Attach the file if filePath is provided
    if (filePath) {
        const attachment = fs.readFileSync(filePath).toString('base64'); // Convert the file to base64
        const fileName = path.basename(filePath); // Get the file name

        emailToMe.attachment = [{
            name: fileName,
            content: attachment
        }];
    }

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


