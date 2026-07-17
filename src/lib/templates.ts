export function getOrganizerWelcomeEmail(companyName: string): string {
  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to Ground Zero</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1e293b; }
    @media only screen and (max-width: 640px) {
      .main-table { width: 100% !important; min-width: 100% !important; }
      .hero-padding { padding: 40px 20px !important; }
      .content-padding { padding: 30px 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color: #1e293b;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f8fafc" style="table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 30px 10px;">
        <table class="main-table" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; border-collapse: separate;">
          <!-- Hero Section -->
          <tr>
            <td class="hero-padding" bgcolor="#0f172a" style="padding: 50px; background-color: #0f172a; text-align: left; color: #ffffff;">
              <span style="font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; color: #94a3b8; display: block; padding-bottom: 12px;">Ground Zero • Organizer Network</span>
              <h1 style="font-size: 32px; font-weight: 800; line-height: 1.2; margin: 0 0 10px 0; color: #ffffff;">Welcome, ${companyName}!</h1>
              <p style="font-size: 16px; line-height: 1.5; color: #cbd5e1; margin: 0;">Get ready to supercharge your college festival. Manage layout maps, list stalls, and connect with sponsors seamlessly.</p>
            </td>
          </tr>
          <!-- Content Body -->
          <tr>
            <td class="content-padding" style="padding: 40px; background-color: #ffffff;">
              <p style="font-size: 16px; line-height: 1.6; color: #334155; margin: 0 0 24px 0;">
                Thank you for listing your organizing committee with **Ground Zero**. We are here to help you turn your next college fest into a massive commercial success with structured stall allocations and brand collaborations.
              </p>
              
              <h3 style="font-size: 18px; font-weight: 700; margin: 0 0 16px 0; color: #0f172a;">Your Next Steps:</h3>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                <tr>
                  <td valign="top" style="padding: 0 12px 16px 0; font-size: 16px; font-weight: bold; color: #6366f1;">01</td>
                  <td valign="top" style="padding-bottom: 16px; font-size: 15px; line-height: 1.5; color: #475569;">
                    <strong>List Your Festival:</strong> Go to your organizer dashboard and submit your upcoming fest timeline, expected footfall, and demographics.
                  </td>
                </tr>
                <tr>
                  <td valign="top" style="padding: 0 12px 16px 0; font-size: 16px; font-weight: bold; color: #6366f1;">02</td>
                  <td valign="top" style="padding-bottom: 16px; font-size: 15px; line-height: 1.5; color: #475569;">
                    <strong>Setup the Stall Map:</strong> Create or upload your interactive stall blueprint so brands and food vendors can see available slots.
                  </td>
                </tr>
                <tr>
                  <td valign="top" style="padding: 0 12px 0 0; font-size: 16px; font-weight: bold; color: #6366f1;">03</td>
                  <td valign="top" style="font-size: 15px; line-height: 1.5; color: #475569;">
                    <strong>Collect Bookings:</strong> Approve negotiation bids, track payments, and communicate directly with stall owners.
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table border="0" cellspacing="0" cellpadding="0" align="center" style="margin-bottom: 24px;">
                <tr>
                  <td align="center" bgcolor="#6366f1" style="border-radius: 8px;">
                    <a href="https://www.thinkthrough.in/dashboard/organizer" target="_blank" style="font-size: 15px; font-weight: bold; color: #ffffff; text-decoration: none; padding: 14px 28px; display: inline-block;">
                      Go to Organizer Dashboard
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td bgcolor="#f1f5f9" style="padding: 24px 40px; border-top: 1px solid #e2e8f0; font-size: 13px; line-height: 1.5; color: #64748b; text-align: center;">
              ThinkThrough Ground Zero • India's Festival Commerce Platform<br />
              Need help? Contact us at <a href="mailto:support@thinkthrough.in" style="color: #6366f1; text-decoration: none;">support@thinkthrough.in</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function getBrandWelcomeEmail(companyName: string): string {
  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to Ground Zero</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #fcfcf9; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1c1c1c; }
    @media only screen and (max-width: 640px) {
      .main-table { width: 100% !important; min-width: 100% !important; }
      .hero-padding { padding: 40px 20px !important; }
      .content-padding { padding: 30px 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #fcfcf9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color: #1c1c1c;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#fcfcf9" style="table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 30px 10px;">
        <table class="main-table" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; border: 1px solid #efe7da; overflow: hidden; border-collapse: separate;">
          <!-- Hero Section -->
          <tr>
            <td class="hero-padding" bgcolor="#0a0a0a" style="padding: 50px; background-color: #0a0a0a; text-align: left; color: #ffffff;">
              <span style="font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; color: #a1a1aa; display: block; padding-bottom: 12px;">Ground Zero • Brand Activation Network</span>
              <h1 style="font-size: 32px; font-weight: 800; line-height: 1.2; margin: 0 0 10px 0; color: #ffffff;">Accelerate Offline Acquisition</h1>
              <p style="font-size: 16px; line-height: 1.5; color: #d4d4d8; margin: 0;">Welcome, ${companyName}. Connect with India's largest college fests to engage real students with no bots, no skipping, and a ₹1 CAC.</p>
            </td>
          </tr>
          <!-- Content Body -->
          <tr>
            <td class="content-padding" style="padding: 40px; background-color: #ffffff;">
              <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin: 0 0 24px 0;">
                Hi Team **${companyName}**, welcome to **Ground Zero**. While digital campaigns often bleed money on bots, Ground Zero opens up high-fidelity offline activations at top college festivals across India.
              </p>
              
              <h3 style="font-size: 18px; font-weight: 700; margin: 0 0 16px 0; color: #0a0a0a;">Explore Brand Operations:</h3>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                <tr>
                  <td valign="top" style="padding: 0 12px 16px 0; font-size: 16px; font-weight: bold; color: #a855f7;">•</td>
                  <td valign="top" style="padding-bottom: 16px; font-size: 15px; line-height: 1.5; color: #4b5563;">
                    <strong>Opportunity Finder:</strong> Discover and evaluate fests based on historical footfall, audience score, and target demographics.
                  </td>
                </tr>
                <tr>
                  <td valign="top" style="padding: 0 12px 16px 0; font-size: 16px; font-weight: bold; color: #a855f7;">•</td>
                  <td valign="top" style="padding-bottom: 16px; font-size: 15px; line-height: 1.5; color: #4b5563;">
                    <strong>Interactive Map Booking:</strong> Pick prime spots (food courts, main stages, entries) and submit stall bookings.
                  </td>
                </tr>
                <tr>
                  <td valign="top" style="padding: 0 12px 0 0; font-size: 16px; font-weight: bold; color: #a855f7;">•</td>
                  <td valign="top" style="font-size: 15px; line-height: 1.5; color: #4b5563;">
                    <strong>Stall ROI Estimator:</strong> Run simulations on your stall layout parameters to estimate footfall conversion rates and margins.
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table border="0" cellspacing="0" cellpadding="0" align="center" style="margin-bottom: 24px;">
                <tr>
                  <td align="center" bgcolor="#0a0a0a" style="border-radius: 8px;">
                    <a href="https://www.thinkthrough.in/dashboard/vendor" target="_blank" style="font-size: 15px; font-weight: bold; color: #ffffff; text-decoration: none; padding: 14px 28px; display: inline-block;">
                      Explore Fest Opportunities
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td bgcolor="#fafaf9" style="padding: 24px 40px; border-top: 1px solid #efe7da; font-size: 13px; line-height: 1.5; color: #78716c; text-align: center;">
              ThinkThrough Ground Zero • Direct Youth Engagement Network<br />
              Questions? Write to <a href="mailto:brands@thinkthrough.in" style="color: #a855f7; text-decoration: none;">brands@thinkthrough.in</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function getVendorWelcomeEmail(companyName: string): string {
  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to Ground Zero</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f0fdf4; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #166534; }
    @media only screen and (max-width: 640px) {
      .main-table { width: 100% !important; min-width: 100% !important; }
      .hero-padding { padding: 40px 20px !important; }
      .content-padding { padding: 30px 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f0fdf4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color: #166534;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f0fdf4" style="table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 30px 10px;">
        <table class="main-table" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; border: 1px solid #dcfce7; overflow: hidden; border-collapse: separate;">
          <!-- Hero Section -->
          <tr>
            <td class="hero-padding" bgcolor="#15803d" style="padding: 50px; background-color: #15803d; text-align: left; color: #ffffff;">
              <span style="font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; color: #bbf7d0; display: block; padding-bottom: 12px;">Ground Zero • Vendor Network</span>
              <h1 style="font-size: 32px; font-weight: 800; line-height: 1.2; margin: 0 0 10px 0; color: #ffffff;">Grow Your Business!</h1>
              <p style="font-size: 16px; line-height: 1.5; color: #dcfce7; margin: 0;">Welcome, ${companyName}. Get access to premium food stalls, retail spots, and fashion arenas at major fests.</p>
            </td>
          </tr>
          <!-- Content Body -->
          <tr>
            <td class="content-padding" style="padding: 40px; background-color: #ffffff;">
              <p style="font-size: 16px; line-height: 1.6; color: #1e293b; margin: 0 0 24px 0;">
                Hi **${companyName}**, welcome to the Ground Zero Vendor family! We help retail brands, cafes, food trucks, and apparel labels book premium stalls directly at India's largest college fests.
              </p>
              
              <h3 style="font-size: 18px; font-weight: 700; margin: 0 0 16px 0; color: #166534;">Your Perks on Ground Zero:</h3>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                <tr>
                  <td valign="top" style="padding: 0 12px 16px 0; font-size: 16px; font-weight: bold; color: #22c55e;">✓</td>
                  <td valign="top" style="padding-bottom: 16px; font-size: 15px; line-height: 1.5; color: #334155;">
                    <strong>Direct Bookings:</strong> Skip mediator agents and WhatsApp brokers. Book stall space directly at official rates.
                  </td>
                </tr>
                <tr>
                  <td valign="top" style="padding: 0 12px 16px 0; font-size: 16px; font-weight: bold; color: #22c55e;">✓</td>
                  <td valign="top" style="padding-bottom: 16px; font-size: 15px; line-height: 1.5; color: #334155;">
                    <strong>Direct Negotiations:</strong> Bid on prices and submit requests directly to college organizers.
                  </td>
                </tr>
                <tr>
                  <td valign="top" style="padding: 0 12px 0 0; font-size: 16px; font-weight: bold; color: #22c55e;">✓</td>
                  <td valign="top" style="font-size: 15px; line-height: 1.5; color: #334155;">
                    <strong>Secure Payments:</strong> Pay securely through verified escrow channels that keep your bookings protected.
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table border="0" cellspacing="0" cellpadding="0" align="center" style="margin-bottom: 24px;">
                <tr>
                  <td align="center" bgcolor="#166534" style="border-radius: 8px;">
                    <a href="https://www.thinkthrough.in/dashboard/vendor" target="_blank" style="font-size: 15px; font-weight: bold; color: #ffffff; text-decoration: none; padding: 14px 28px; display: inline-block;">
                      Explore Stall Booking Map
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td bgcolor="#f0fdf4" style="padding: 24px 40px; border-top: 1px solid #dcfce7; font-size: 13px; line-height: 1.5; color: #166534; text-align: center;">
              ThinkThrough Ground Zero • India's Offline Fest Commerce Network<br />
              Need support? Contact us at <a href="mailto:vendors@thinkthrough.in" style="color: #22c55e; text-decoration: none;">vendors@thinkthrough.in</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
