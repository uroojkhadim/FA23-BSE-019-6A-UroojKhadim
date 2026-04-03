import nodemailer from 'nodemailer';

// Create transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // You can change this to your preferred email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send email notification for pending payment
 */
export const sendPendingPaymentEmail = async (userEmail, orderDetails) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Uni Cafe" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: 'Payment Pending - Uni Cafe',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #667eea; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🍽️ Uni Cafe</h1>
              <p>Payment Notification</p>
            </div>
            
            <div class="content">
              <h2>Payment Pending</h2>
              <p>Dear Valued Customer,</p>
              
              <p>Your order is pending payment. Please complete your payment to confirm your order.</p>
              
              <div class="order-details">
                <h3>Order Details:</h3>
                <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
                <p><strong>Order Date:</strong> ${new Date(orderDetails.createdAt).toLocaleDateString()}</p>
                <p><strong>Total Amount:</strong> Rs. ${orderDetails.totalAmount}</p>
                <p><strong>Status:</strong> <span style="color: #ff9800;">Pending Payment</span></p>
                
                ${orderDetails.items && orderDetails.items.length > 0 ? `
                  <h4>Items:</h4>
                  <ul>
                    ${orderDetails.items.map(item => `
                      <li>${item.name} x ${item.quantity} - Rs. ${item.price}</li>
                    `).join('')}
                  </ul>
                ` : ''}
              </div>
              
              <p>Please visit our cafe or contact us to complete your payment.</p>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/student/orders" class="button">View Order</a>
              </div>
              
              <p>If you have any questions, please don't hesitate to contact us.</p>
              
              <p>Best regards,<br/>
              <strong>Uni Cafe Team</strong></p>
            </div>
            
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>&copy; ${new Date().getFullYear()} Uni Cafe. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Payment Pending - Uni Cafe
        
        Dear Valued Customer,
        
        Your order is pending payment. Please complete your payment to confirm your order.
        
        Order Details:
        - Order ID: ${orderDetails.orderId}
        - Order Date: ${new Date(orderDetails.createdAt).toLocaleDateString()}
        - Total Amount: Rs. ${orderDetails.totalAmount}
        - Status: Pending Payment
        
        Please visit our cafe or contact us to complete your payment.
        
        Best regards,
        Uni Cafe Team
        
        This is an automated message. Please do not reply to this email.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send order status update email
 */
export const sendOrderStatusUpdateEmail = async (userEmail, orderDetails, newStatus) => {
  try {
    const transporter = createTransporter();
    
    const statusColors = {
      'completed': { color: '#4caf50', text: 'Completed ✅' },
      'preparing': { color: '#2196f3', text: 'Preparing 🍳' },
      'ready': { color: '#ff9800', text: 'Ready for Pickup 🎉' },
      'cancelled': { color: '#f44336', text: 'Cancelled ❌' },
    };

    const statusInfo = statusColors[newStatus] || { color: '#666', text: newStatus };
    
    const mailOptions = {
      from: `"Uni Cafe" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Order Status Update - ${newStatus}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .status-badge { display: inline-block; background: ${statusInfo.color}; color: white; padding: 8px 20px; border-radius: 20px; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🍽️ Uni Cafe</h1>
              <p>Order Status Update</p>
            </div>
            
            <div class="content">
              <h2>Your Order Status Has Been Updated</h2>
              <p>Good news! Your order status has been updated.</p>
              
              <p style="text-align: center; margin: 30px 0;">
                <span class="status-badge">${statusInfo.text}</span>
              </p>
              
              <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
              <p><strong>Updated:</strong> ${new Date().toLocaleString()}</p>
              
              <p>Thank you for ordering with us!</p>
              
              <p>Best regards,<br/>
              <strong>Uni Cafe Team</strong></p>
            </div>
            
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Uni Cafe. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Status update email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending status update email:', error);
    return { success: false, error: error.message };
  }
};
