var nodemailer = require("nodemailer");

module.exports.sendMail = (host, email, id, callback) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'mail.republicakatapulta.com.br',
        port: 25,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'teste@republicakatapulta.com.br', // generated ethereal user
            pass: '123ab' // generated ethereal password
        },
        tls: {
            rejectUnauthorized:false
        }
    });

    link="http://"+host+"/users/verify?id="+id;
    mailOptions={
        from: '"Camilo Avelar" <teste@republicakatapulta.com.br>',
        to : email,
        subject : "Please confirm your Email account",
        html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
    }
    console.log(mailOptions);
    transporter.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("Message sent: " + response.messageId);
        callback(null, 'Message Sent');
        }
    });
    transporter.verify(function(error, success) {
        if (error) {
             console.log(error);
        } else {
             console.log('Server is ready to take our messages');
        }
     });
};