const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Welcome to HotDeals</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #E5E5E5;
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
      }

      .container {
        max-width: 600px;
        padding: 40px;
        text-align: center;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      h1 {
        color: #333333;
        margin-bottom: 20px;
      }

      p {
        color: #666666;
        font-size: 18px;
        line-height: 1.5;
      }

      .download-links {
        margin-top: 30px;
      }

      .download-links a {
        display: inline-block;
        margin: 10px;
        text-decoration: none;
        padding: 10px 20px;
        border-radius: 4px;
        background-color: #333333;
        color: #ffffff;
        font-size: 16px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Welcome to HotDeals</h1>
      <p>Thank you for visiting!</p>
      <div class="download-links">
        <a href="https://play.google.com/store/apps/details?id=in.HotDeals.app" target="_blank">Download from Play Store</a>
        <a href="https://apps.apple.com/in/app/HotDeals-best-buy-sell-app/id1666569292" target="_blank">Download from App Store</a>
      </div>
    </div>
  </body>
</html>
`;

module.exports = html