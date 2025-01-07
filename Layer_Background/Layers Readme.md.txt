## About Layers

# Carbon:
This analysis evaluates carbon storage and sequestration in Hennepin County to support climate action and land-use planning. Data from multiple sources, including land cover dataset NLCD 2021 and remote sensing tools (FLUXCOM, Landsat NPP, MODIS NPP, NorthFlux), were harmonized and analyzed. Carbon storage and sequestration rates were estimated for eight land cover types: forests, wetlands, urban areas, and more. These rates were applied to detailed land cover maps to calculate carbon dynamics across the county. Therefore, a raster with carbon fluxes and storage rates was produced by combining all the aforementioned data sources and sampled in 30 m spatial resolution for 2021.

# Parcels:
The parcel prioritization model for Hennepin County assigns values to each parcel using a conservation easement scoring system. This system considers variables such as spatial context, size, habitat quality and diversity, wildlife and plant conservation, risk of conservation, and water resources. The model processes shapefile layers for each variable, joins them spatially to the parcels, and calculates relational statistics (e.g., area within, distance from). Each variable is assigned a value and multiplied by a set weight. These weighted values are then summed to produce an overall conservation priority value for each parcel.
