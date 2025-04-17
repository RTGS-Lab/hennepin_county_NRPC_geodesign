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
  window.addEventListener("message", async function(event) {
    if (event.origin !== "https://rtgs-lab.github.io") { 
      console.warn("Unauthorized message origin:", event.origin);
      return; // Ignore messages from untrusted origins
    }

    console.log("Received message:", event.data);

    // Extract the authorization code from the received URL
    const urlParams = new URLSearchParams(new URL(event.data).search);
    const authorizationCode = urlParams.get("code");

    if (authorizationCode) {
      console.log("Authorization code received:", authorizationCode);

      // Exchange the authorization code for an access token
      const exchangeTokenUrl = "https://www.arcgis.com/sharing/rest/oauth2/token/";
      const params = new URLSearchParams({
        client_id: "NpCWXmG2uJLnOlXc",  // Your App ID
        grant_type: "authorization_code",
        code: authorizationCode,  // Authorization code extracted from URL
        redirect_uri: "https://rtgs-lab.github.io/hennepin_county_NRPC_geodesign/Activity_1_Webapp/callback.html"
      });

      try {
        const response = await fetch(exchangeTokenUrl, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params.toString()
        });

        const data = await response.json();

        if (data.access_token) {
          console.log("Access token retrieved:", data.access_token);

          // Register the token with IdentityManager
          IdentityManager.registerToken({
            token: data.access_token,
            expires: new Date(Date.now() + data.expires_in * 1000),
            userId: "AuthenticatedUser"
          });

          console.log("User successfully signed in!");
          loadWebMap(); // Load the web map now that authentication is complete
        } else {
          console.error("Failed to retrieve access token:", data.error);
        }
      } catch (error) {
        console.error("Token exchange error:", error);
      }

    } else {
      console.error("Authorization code missing from URL.");
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

      // Locate the target layer for editing
      const targetLayer = webmap.layers.find(layer => 
        layer.title === "Winter Workshop Activity 1" // Adjust based on your layer
      );

      // Create Editor widget if the target layer exists
      if (targetLayer) {
        const editor = new Editor({
          view: view,
          layerInfos: [{
            layer: targetLayer,
            attachmentsOnUpdateEnabled: false,
            attachmentsOnCreateEnabled: false
          }]
        });
        view.ui.add(editor, "top-right");
      } else {
        console.warn("Target layer not found!");
      }

      // Create and add text box with instructions
      const textBox = document.createElement("div");
      textBox.className = "text-box";
      textBox.innerText = "What are areas that are no-brainers for natural systems conservation/preservation in your jurisdiction?";
      document.body.appendChild(textBox);

      // Add the first link box with source information
      const linkBox = document.createElement("div");
      linkBox.className = "link-box";
      linkBox.innerHTML = '<a href="https://z.umn.edu/a2br" target="_blank">More about the layers</a>';
      document.body.appendChild(linkBox);

      // Add a second link box for transitioning to Activity 2
      const secondLinkBox = document.createElement("div");
      secondLinkBox.className = "second-link-box";
      secondLinkBox.innerHTML = '<a href="https://z.umn.edu/NRPCActivity2" target="_blank">Go to second activity</a>';
      document.body.appendChild(secondLinkBox);
    });
  }
});
