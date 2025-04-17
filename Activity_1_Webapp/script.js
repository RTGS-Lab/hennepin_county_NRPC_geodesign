require([
  "esri/WebMap",
  "esri/views/MapView",
  "esri/widgets/Home",
  "esri/widgets/Editor",
  "esri/widgets/LayerList",
  "esri/widgets/Legend",
  "esri/widgets/Zoom",
  "esri/identity/OAuthInfo",
  "esri/identity/IdentityManager"
], (
  WebMap, MapView, Home, Editor, LayerList, Legend, Zoom, OAuthInfo, IdentityManager
) => {
  
  // Create an OAuthInfo object to handle authentication
  const oAuthInfo = new OAuthInfo({
    appId: "NpCWXmG2uJLnOlXc", // Application ID created in ArcGIS Online
    popup: true, // Open OAuth in a popup window
    popupCallbackUrl: "https://rtgs-lab.github.io/hennepin_county_NRPC_geodesign/Activity_1_Webapp/callback.html" // Callback URL for authentication
  });

  // Register OAuth information with IdentityManager
  IdentityManager.registerOAuthInfos([oAuthInfo]);

  // Listen for authentication response messages from callback.html
  window.addEventListener("message", function(event) {
    if (event.origin !== "https://rtgs-lab.github.io") { 
      console.warn("Unauthorized message origin:", event.origin);
      return; // Ignore messages from untrusted origins
    }

    console.log("Received token URL:", event.data);

    // Extract the token and expiration time from the received URL
    const urlParams = new URLSearchParams(event.data.split("?")[1]);
    const token = urlParams.get("access_token");
    const expiresIn = urlParams.get("expires_in");

    if (token) {
      // Register the token with IdentityManager to establish user authentication
      IdentityManager.registerToken({
        token: token,
        expires: new Date(Date.now() + expiresIn * 1000), // Convert expiry time to actual date
        userId: "AuthenticatedUser" // Placeholder user ID
      });

      console.log("User successfully signed in!");
      loadWebMap(); // Load the web map now that authentication is complete
    } else {
      console.error("Failed to retrieve token from URL.");
    }
  });

  // Check if the user is already signed in
  IdentityManager.checkSignInStatus(oAuthInfo.portalUrl + "/sharing").then(() => {
    console.log("User is already signed in!");
    loadWebMap(); // Proceed with loading the web map
  }).catch(() => {
    console.log("Sign-in required.");
    IdentityManager.getCredential(oAuthInfo.portalUrl + "/sharing"); // Prompt for sign-in
  });

  // Function to load the WebMap after successful authentication
  function loadWebMap() {
    // Create a map from the web map ID for "20241031_Demo_map" in ArcGIS Online
    const webmap = new WebMap({
      portalItem: {
        id: "bc54085fffa045a5a4911f3274ab97e0"
      }
    });

    // Create a MapView to display the map
    const view = new MapView({
      container: "viewDiv", // Element ID where the map will be placed
      map: webmap,
      constraints: {
        rotationEnabled: false // Prevent rotation
      }
    });

    // Execute when the view is ready
    view.when(() => {
      console.log("WebMap loaded successfully.");
      
      // Add the Home button widget
      const home = new Home({ view });
      view.ui.add(home, "top-left");

      // Add the LayerList widget
      const layerList = new LayerList({ view });
      view.ui.add(layerList, "bottom-left");
    });

      // Add a text box in the upper-left corner
      const textBox = document.createElement("div");
      textBox.className = "text-box";
      textBox.innerText = "What are areas that are no-brainers for natural systems conservation/preservation in your jurisdiction?";
      document.body.appendChild(textBox);

      // Add the link box for sources
      const linkBox = document.createElement("div");
      linkBox.className = "link-box";
      linkBox.innerHTML = '<a href="https://z.umn.edu/a2br" target="_blank">More about the layers</a>';
      document.body.appendChild(linkBox);
          
      // Add a box for link to Activity 2 app
      const secondlinkBox = document.createElement("div");
      secondlinkBox.className = "second-link-box";
      secondlinkBox.innerHTML = '<a href ="https://z.umn.edu/NRPCActivity2" target="_blank">Go to second activity</a>';
      document.body.appendChild(secondlinkBox);
  }
});

      

    });
  });
