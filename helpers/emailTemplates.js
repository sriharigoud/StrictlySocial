export const welcomeMessage = `
<center style="width: 100%; background: #F1F1F1; text-align: left;">
<div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;"> (Optional) This text will appear in the inbox preview, but not the email body. </div>
<div style="max-width: 680px; margin: auto;" class="email-container">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 680px;" class="email-container">
        <tr>
            <td bgcolor="#d7a2fd">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                        <td style="padding: 10px; text-align: center;"> <span style="color:#b664f2; font-size: 30px"><a href="http://${req.headers.host}" target="_blank">StrictlySocial</a></span> </td>
                    </tr>
                </table>
            </td>
        </tr>
      
        <tr>
            <td bgcolor="#ffffff">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                        <td style="padding: 10px 40px 10px 40px; text-align: left;">
                            <h1 style="margin: 0; font-family: 'Montserrat', sans-serif; font-size: 20px; line-height: 26px; color: #333333; font-weight: bold;">YOUR ACCOUNT IS NOW ACTIVE</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0px 20px 10px 40px; font-family: sans-serif; font-size: 15px; line-height: 20px; color: #555555; text-align: left; font-weight:bold;">
                            <p style="margin: 0;">Thanks for choosing our StrictlySocial.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0px 40px 10px 40px; font-family: sans-serif; font-size: 15px; line-height: 20px; color: #555555; text-align: left; font-weight:normal;">
                            <p style="margin: 0;">Follow, Like, Comment and Share in StrictlySocial way :)</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr> 
      
       
    </table>
</div>
</center>`;
