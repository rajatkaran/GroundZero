/**
 * Ground Zero WhatsApp Integration Mock Service
 * Keep options open for WhatsApp webhook notifications.
 */

interface SendWhatsAppParams {
  to: string;
  templateName: string;
  variables: Record<string, string>;
}

export async function sendWhatsAppMessage({ to, templateName, variables }: SendWhatsAppParams): Promise<boolean> {
  console.log("-----------------------------------------------------------------");
  console.log(`[WHATSAPP MOCK INTEGRATION] Sending notification via WhatsApp...`);
  console.log(`Recipient Phone: ${to}`);
  console.log(`Template Name: ${templateName}`);
  console.log("Template Variables:", JSON.stringify(variables, null, 2));
  console.log("-----------------------------------------------------------------");
  
  // Simulated success response. 
  // In production, you would wire this to a Twilio or Meta WhatsApp Business API webhook:
  /*
  const response = await fetch("https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json", {
    method: "POST",
    headers: {
      "Authorization": "Basic " + btoa("ACCOUNT_SID:AUTH_TOKEN"),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      To: `whatsapp:${to}`,
      From: "whatsapp:+14155238886", // Twilio Sandbox Number
      Body: `Hi ${variables.vendorName}, your booking for Stall ${variables.stallNumber} at ${variables.festivalName} is confirmed! Price: INR ${variables.price}.`
    })
  });
  return response.ok;
  */

  return true;
}

// 1. Send Booking Confirmation Message
export async function sendBookingConfirmationWhatsApp(
  vendorPhone: string,
  vendorName: string,
  festivalName: string,
  stallNumber: string,
  price: number
) {
  return sendWhatsAppMessage({
    to: vendorPhone,
    templateName: "gz_booking_confirmation",
    variables: {
      vendorName,
      festivalName,
      stallNumber,
      price: `₹${price.toLocaleString("en-IN")}`
    }
  });
}

// 2. Send Live Negotiation Pricing Counter-Offer Update
export async function sendNegotiationUpdateWhatsApp(
  vendorPhone: string,
  vendorName: string,
  festivalName: string,
  stallNumber: string,
  price: number,
  senderRole: string
) {
  return sendWhatsAppMessage({
    to: vendorPhone,
    templateName: "gz_negotiation_proposal",
    variables: {
      vendorName,
      festivalName,
      stallNumber,
      price: `₹${price.toLocaleString("en-IN")}`,
      senderRole
    }
  });
}

// 3. Send Payment Invoice / Digital Receipt Confirmation
export async function sendReceiptWhatsApp(
  vendorPhone: string,
  vendorName: string,
  festivalName: string,
  stallNumber: string,
  amount: number,
  receiptUrl: string
) {
  return sendWhatsAppMessage({
    to: vendorPhone,
    templateName: "gz_receipt_invoice",
    variables: {
      vendorName,
      festivalName,
      stallNumber,
      amount: `₹${amount.toLocaleString("en-IN")}`,
      receiptUrl
    }
  });
}

// 4. Send Vendor Welcome Message on Signup
export async function sendVendorWelcomeWhatsApp(
  vendorPhone: string,
  vendorName: string
) {
  return sendWhatsAppMessage({
    to: vendorPhone,
    templateName: "gz_vendor_welcome",
    variables: {
      vendorName
    }
  });
}

// 5. Send Notification when a new Event/Festival goes Live
export async function sendEventPublishedWhatsApp(
  vendorPhone: string,
  vendorName: string,
  festivalName: string,
  festivalUrl: string
) {
  return sendWhatsAppMessage({
    to: vendorPhone,
    templateName: "gz_event_published",
    variables: {
      vendorName,
      festivalName,
      festivalUrl
    }
  });
}
