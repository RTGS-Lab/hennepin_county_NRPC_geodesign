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
      // Create an OAuthInfo object
      const oAuthInfo = new OAuthInfo({
          appId: "NpCWXmG2uJLnOlXc", // Application ID created in ArcGIS Online
          popup: true, // Open OAuth in a popup window
          popupCallbackUrl: "https://rtgs-lab.github.io/hennepin_county_NRPC_geodesign/Activity_1_Webapp/callback.html" // Redirect back to web app
              });
      
      // Register OAuth Info with IdentityManager
      IdentityManager.registerOAuthInfos([oAuthInfo]);
      
      //Check if user is already signed in
      IdentityManager.checkSignInStatus(oAuthInfo.portalUrl + "/sharing").then(() => {
          loadWebMap();
      }).catch(() => {
          // User is not signed in, prompt for sign in
          IdentityManager.getCredential(oAuthInfo.portalUrl + "/sharing");
      });
      
    // Create a map from the webmap id for "20241031_Demo_map" in ArcGIS Online
    const webmap = new WebMap({
      portalItem: {
        id: "bc54085fffa045a5a4911f3274ab97e0"
      }
    });

    const view = new MapView({
      container: "viewDiv",
      map: webmap,
      constraints: {
        rotationEnabled: false
      }
    });

    view.when(() => {
      // Create a container div for the Legend
      const legendContainer = document.createElement("div");
      legendContainer.id = "legend-container";
      document.body.appendChild(legendContainer);
  
      // Add the Legend widget to the container
      const legend = new Legend({
        view: view,
        container: legendContainer
      });
  
      view.ui.add(legendContainer, {
        position: "top-left",
        index: 1
      });
    });

    const home = new Home({
      view: view
    });
  
    // Add the Home widget to a custom position
    const homeContainer = document.createElement("div");
    homeContainer.className = "home-container";
    document.body.appendChild(homeContainer);
  
    home.container = homeContainer;
  
    view.ui.add(homeContainer, "manual");
  
    view.when(() => {

      // Log each layer with its index and title in the WebMap
      console.log("Available Layers:");
      webmap.layers.forEach((layer, index) => {
        console.log(`Layer Index: ${index}, Title: ${layer.title}, ID: ${layer.id}`);
      });

      // Find the layer we're editing by title
      const targetLayer = webmap.layers.find(layer => 
        layer.title === "Winter Workshop Activity 1"  // Change to appropriate layer if using for another webapp or project
      );

      // Create editor, change settings to remove the ability to add or edit attachments
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

      // Create the LayerList widget
      const layerList = new LayerList({
        view: view
      });

      // Add LayerList to the bottom-left of the view
      view.ui.add(layerList, {
        position: "bottom-left"
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

    });
  });
