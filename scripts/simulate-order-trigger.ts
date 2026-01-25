
import { sendMail } from '../src/lib/sendMail';

const simulateOrderTrigger = async () => {
  console.log('Simulating successful order trigger...');

  // 1. Mock Order Data (as received in verify-payment route)
  const orderNumber = `LUM${new Date().getFullYear().toString().slice(-2)}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const orderData = {
    email: 'shivampaul2319@gmail.com', // User's email
    firstName: 'Shivam',
    lastName: 'Paul',
    shippingAddress: {
      addressLine1: '123 Luxury Lane',
      addressLine2: 'Apt 4B',
      city: 'Mumbai',
      pincode: '400001',
      state: 'Maharashtra'
    },
    items: [
      { name: 'Midnight Jasmine Candle', quantity: 2, price: 850 },
      { name: 'Santal & Cedar Candle', quantity: 1, price: 1200 }
    ],
    total: 2900
  };

  const stateValue = orderData.shippingAddress.state;

  // 2. Execute the EXACT logic from src/app/api/verify-payment/route.ts
  console.log(`Sending confirmation for Order: ${orderNumber}`);
  
  try {
    const itemsList = orderData.items.map((item: any) => 
      `- ${item.name} (x${item.quantity}): ₹${item.price * item.quantity}`
    ).join('\n');

    const emailMessage = `Dear ${orderData.firstName || 'Customer'},\n\n` +
      `Thank you for your order with Lumera Candles! Your order has been successfully placed.\n\n` +
      `Order Number: ${orderNumber}\n` +
      `Order Total: ₹${orderData.total || 0}\n\n` +
      `Items Ordered:\n${itemsList}\n\n` +
      `Shipping Address:\n` +
      `${orderData.shippingAddress.addressLine1}\n` +
      `${orderData.shippingAddress.addressLine2 ? orderData.shippingAddress.addressLine2 + '\n' : ''}` +
      `${orderData.shippingAddress.city}, ${stateValue} - ${orderData.shippingAddress.pincode}\n\n` +
      `We will notify you once your order is shipped.\n\n` +
      `Best regards,\nThe Lumera Team`;

    const info = await sendMail({
      to: orderData.email,
      subject: `Order Confirmed - ${orderNumber}`,
      message: emailMessage,
    });

    console.log('SUCCESS: Order confirmation email triggered.');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('FAILURE: Failed to trigger order email.');
    console.error(error);
  }
};

simulateOrderTrigger();
