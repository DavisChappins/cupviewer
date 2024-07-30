const iconSettings = {
    0: 'icons/map_town.svg',
    1: 'icons/map_town.svg',
    2: 'icons/alt_landable_airport_dirt.svg',
    3: 'icons/alt_landable_field.svg',
    4: 'icons/alt_gliding_airport.svg',
    5: 'icons/alt_reachable_airport.svg',
    6: 'icons/map_pass.svg',
    7: 'icons/map_mountain_top.svg',
    8: 'icons/map_obstacle.svg',
    9: 'icons/map_vor.svg',
    10: 'icons/map_ndb.svg',
    11: 'icons/map_tower.svg',
    12: 'icons/map_dam.svg',
    13: 'icons/map_tunnel.svg',
    14: 'icons/map_bridge.svg',
    15: 'icons/map_power_plant.svg',
    16: 'icons/map_castle.svg',
    17: 'icons/map_intersection.svg'
};

// Add the mapping as a constant
const styleMapping = {
    0: "Unknown",
    1: "Waypoint",
    2: "Airfield with a grass/dirt runway",
    3: "Outlanding/field",
    4: "Gliding airfield",
    5: "Airfield with a paved runway",
    6: "Mountain Pass",
    7: "Mountain Top",
    8: "Transmitter Mast",
    9: "VOR",
    10: "NDB",
    11: "Cooling Tower",
    12: "Dam",
    13: "Tunnel",
    14: "Bridge",
    15: "Power Plant",
    16: "Castle",
    17: "Intersection"
};





const ICON_SIZES = {
    0: [6, 6],   // Icon size at zoom level 0
    1: [6, 6],   // Icon size at zoom level 1
    2: [7, 7],   // Icon size at zoom level 2
    3: [8, 8],   // Icon size at zoom level 3
    4: [8, 8],   // Icon size at zoom level 4
    5: [8, 8],   // Icon size at zoom level 5
    6: [9, 9],   // Icon size at zoom level 6
    7: [9, 9],   // Icon size at zoom level 7
    8: [10, 10],   // Icon size at zoom level 8
    9: [10, 10],   // Icon size at zoom level 9
    10: [14, 14], // Icon size at zoom level 10 and above
    11: [16, 16],
    12: [20, 20],
    13: [20, 20],
    14: [20, 20],
    15: [20, 20],
    16: [20, 20],
    17: [20, 20],
    18: [20, 20],
    19: [20, 20],
    20: [20, 20],
    21: [20, 20],
    22: [20, 20]
};

const TEXT_SIZES = {
    0: { size: '10px', visible: false },
    1: { size: '10px', visible: false },
    2: { size: '10px', visible: false },
    3: { size: '10px', visible: false },
    4: { size: '10px', visible: false },
    5: { size: '10px', visible: false },
    6: { size: '10px', visible: false },
    7: { size: '10px', visible: false },
    8: { size: '10px', visible: false },
    9: { size: '10px', visible: true },
    10: { size: '10px', visible: true },
    11: { size: '10px', visible: true },
    12: { size: '12px', visible: true },
    13: { size: '12px', visible: true },
    14: { size: '12px', visible: true },
    15: { size: '12px', visible: true },
    16: { size: '12px', visible: true },
    17: { size: '12px', visible: true },
    18: { size: '12px', visible: true },
    19: { size: '12px', visible: true },
    20: { size: '12px', visible: true },
    21: { size: '12px', visible: true },
    22: { size: '12px', visible: true }
};

function convertDMSToDD(dms) {
    const degreesPart = dms.substring(0, dms.length - 7);
    const degrees = parseInt(degreesPart);
    const minutes = parseFloat(dms.substring(dms.length - 7, dms.length - 1));
    const direction = dms.charAt(dms.length - 1);
    let dd = Math.abs(degrees) + (minutes / 60);
    if (direction === 'S' || direction === 'W' || degreesPart.startsWith('-')) {
        dd = -dd;
    }
    return dd;
}


function convertDDToDMM(dd, isLat) {
	const direction = dd >= 0 ? (isLat ? 'N' : 'E') : (isLat ? 'S' : 'W');
	const absoluteDD = Math.abs(dd);
	const degrees = Math.floor(absoluteDD);
	const minutes = (absoluteDD - degrees) * 60;
	return `${degrees}${minutes.toFixed(3).padStart(6, '0')}${direction}`;
}

function metersToFeet(meters) {
    const feet = Math.round(meters * 3.28084) + ' ft';
    console.log(`Converting ${meters} meters to ${feet}`);
    return feet;
}

function feetToMeters(feet) {
    const meters = Math.round(feet / 3.28084) + ' m';
    console.log(`Converting ${feet} feet to ${meters}`);
    return meters;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    function toRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    const R = 3958.8; // Radius of the Earth in miles
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}






document.addEventListener('DOMContentLoaded', function () {
    // Set the initial view to zoom level 5 and center at lat 38, lon -96
	const streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '© OpenStreetMap contributors'
	});

	const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri',
		maxZoom: 19
	});

    // Google Maps layer
    const googleSatellite = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '© Google'
    });

	const thunderforestLandscape = L.tileLayer('https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=d733519551fd447989259b4a961fb864', {
		attribution: '© <a href="https://carto.com/attributions">CARTO</a>',
		subdomains: 'abcd',
		maxZoom: 22
	});

    const map = L.map('map', {
        center: [38, -96],
        zoom: 5,
        layers: [satellite], // Default layer
		zoomControl: false // Disable the default zoom control
    });
	
	const faaSectional = L.tileLayer('https://tiles.arcgis.com/tiles/ssFJjBXIUyZDrSYZ/arcgis/rest/services/VFR_Sectional/MapServer/tile/{z}/{y}/{x}', {
		maxZoom: 12,
		minZoom: 8,
		attribution: 'FAA Sectional Charts | Esri, FAA',
		tileSize: 256,
		errorTileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==', // 1x1 transparent png
	});

    const baseMaps = {
        "Streets": streets,
        "Aerial": satellite,
        "Satellite": googleSatellite,
        "Topo": thunderforestLandscape,
		"Sectional": faaSectional
    };
	
	// Add event listeners for tile loading events
	faaSectional.on('tileloadstart', function(event) {
		console.log('Tile load started:', event.url);
	});

	faaSectional.on('tileload', function(event) {
		console.log('Tile loaded successfully:', event.tile.src);
	});

	faaSectional.on('tileerror', function(event) {
		console.error('Tile failed to load:', event.tile.src, 'Error:', event.error);
	});



	// Define the ImageAge control
	L.Control.ImageAge = L.Control.extend({
		onAdd: function(map) {
			this._container = L.DomUtil.create('div', 'image-age-container');
			this._text = L.DomUtil.create('span', '', this._container);
			this._map = map;
			this._currentDate = ''; // Store the current date for updates

			map.on('zoomend', this._onZoomChange, this); // Listen for zoom changes
			map.on('baselayerchange', this._onBaseLayerChange, this); // Listen for basemap changes

			this._onZoomChange(); // Set initial state
			return this._container;
		},

		_onZoomChange: function() {
			// Only execute if the control is visible
			if (this._container.style.display !== 'none') {
				var zoom = this._map.getZoom();
				if (zoom >= 12) {
					this._getImageInfo(); // Update image info on zoom change
				} else {
					this._text.innerHTML = 'Zoom in for image date';
				}
			}
		},

		_getImageInfo: function() {
			var center = this._map.getCenter();
			var url = `https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/identify`;

			var params = {
				f: 'json',
				geometry: `${center.lng},${center.lat}`,
				geometryType: 'esriGeometryPoint',
				sr: 4326,
				tolerance: 0,
				mapExtent: this._map.getBounds().toBBoxString(),
				imageDisplay: `${this._map.getSize().x},${this._map.getSize().y},96`,
				returnGeometry: false,
				returnCatalogItems: 'true',
				returnZ: 'true'
			};

			fetch(`${url}?${new URLSearchParams(params).toString()}`)
				.then(response => response.json())
				.then(data => {
					console.log('Full API response:', data);
					if (data.results && data.results.length > 0) {
						var attributes = data.results[0].attributes;
						var srcDate = attributes['SRC_DATE2'];
						if (srcDate) {
							this._text.innerHTML = `Image Date: ${srcDate}`;
						} else {
							this._text.innerHTML = 'Image Date: N/A';
						}
					} else {
						this._text.innerHTML = 'Image Date: N/A';
					}
				})
				.catch(error => {
					console.error('Error fetching image metadata:', error);
					this._text.innerHTML = 'Image Date: Error';
				});
		},

		_onBaseLayerChange: function(e) {
			if (e.name === "Aerial") {
				this._container.style.display = 'block';
				this._onZoomChange(); // Update date info when switching to Aerial
			} else {
				this._container.style.display = 'none';
			}
		}
	});

	// Create an instance of the control
	var imageAgeControl = new L.Control.ImageAge({ position: 'bottomright' });

	// Initially add the control to the map if the current layer is "Aerial"
	if (map.hasLayer(satellite)) {
		imageAgeControl.addTo(map);
	}

	// Handle the baselayerchange event to add or remove the control
	map.on('baselayerchange', function(e) {
		if (e.name === "Aerial") {
			if (!map.hasControl(imageAgeControl)) {
				imageAgeControl.addTo(map);
			}
		} else {
			if (map.hasControl(imageAgeControl)) {
				map.removeControl(imageAgeControl);
			}
		}
	});




	L.Control.MousePosition = L.Control.extend({
		options: {
			position: 'bottomleft',
			separator: ' | ',
			emptyString: 'Unavailable',
			lngFirst: false,
			numDigits: 5,
			lngFormatter: undefined,
			latFormatter: undefined,
			prefix: ""
		},

		onAdd: function (map) {
			this._container = L.DomUtil.create('div', 'leaflet-control-mouseposition');
			L.DomEvent.disableClickPropagation(this._container);
			map.on('mousemove', this._onMouseMove, this);
			map.on('contextmenu', this._onRightClick, this);
			map.on('zoomend', this._onZoomChange, this); // Add zoom change event listener
			this._container.innerHTML = this.options.emptyString;
			this._elevation = 'right click'; // Initialize elevation text
			return this._container;
		},

		onRemove: function (map) {
			map.off('mousemove', this._onMouseMove);
			map.off('contextmenu', this._onRightClick);
			map.off('zoomend', this._onZoomChange); // Remove zoom change event listener
		},

		_onMouseMove: function (e) {
			const lngDD = this.options.lngFormatter ? this.options.lngFormatter(e.latlng.lng) : L.Util.formatNum(e.latlng.lng, this.options.numDigits);
			const latDD = this.options.latFormatter ? this.options.latFormatter(e.latlng.lat) : L.Util.formatNum(e.latlng.lat, this.options.numDigits);
			const valueDD = this.options.lngFirst ? lngDD + this.options.separator + latDD : latDD + this.options.separator + lngDD;
			const prefixAndValueDD = this.options.prefix + ' ' + valueDD;

			const latDMM = convertDDToDMM(e.latlng.lat, true);
			const lngDMM = convertDDToDMM(e.latlng.lng, false);
			const valueDMM = latDMM + this.options.separator + lngDMM;

			this._container.innerHTML = `Elevation: ${this._elevation}<br>${prefixAndValueDD}<br>${valueDMM}`;
		},

		_onRightClick: function (e) {
			const lat = e.latlng.lat;
			const lon = e.latlng.lng;

			// Set elevation text to "loading elevation" immediately upon right-click
			this._elevation = 'Loading...';
			this._onMouseMove(e);

			console.log(`Fetching elevation for coordinates: ${lat}, ${lon}`);

			fetch(`https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lon}`)
				.then(response => response.json())
				.then(data => {
					console.log('Open Elevation API response:', data);
					if (data.results && data.results.length > 0) {
						const elevationMeters = Math.round(data.results[0].elevation);
						const elevationFeet = Math.round(elevationMeters * 3.28084);
						this._elevation = `${elevationFeet}ft | ${elevationMeters}m`;
						console.log(`Elevation retrieved: ${this._elevation}`);
						this._onMouseMove(e);
					} else {
						console.warn('No elevation data in the API response');
						this._elevation = 'N/A';
						this._onMouseMove(e);
					}
				})
				.catch(error => {
					console.error('Error fetching elevation:', error);
					this._elevation = 'API Error';
					this._onMouseMove(e);
				});
		},

		_onZoomChange: function () {
			this._elevation = 'Right click'; // Reset elevation text on zoom change
			this._onMouseMove({ latlng: this._map.getCenter() }); // Update display with map center coordinates
		}
	});

	L.Map.mergeOptions({
		positionControl: false
	});

	L.Map.addInitHook(function () {
		if (this.options.positionControl) {
			this.positionControl = new L.Control.MousePosition();
			this.addControl(this.positionControl);
		}
	});

	L.control.mousePosition = function (options) {
		return new L.Control.MousePosition(options);
	};




	// Add baseMaps to the map with the control layer
	L.control.layers(baseMaps).addTo(map);
	L.control.mousePosition().addTo(map);
	
	L.control.zoom({
		position: 'topright' // Change the position of the zoom control
	}).addTo(map);
	
	




    let markers = []; // Store marker references for updating on zoom change
    let currentPoi = null; // Store the currently displayed POI details
    let lastPoi = null; // Variable to store the last processed POI
	
    /**
     * Extracts approximate coordinates from lat/lon strings
     * @param {string} lat - Latitude in DMS format
     * @param {string} lon - Longitude in DMS format
     * @returns {Array} - Array with approximate [latitude, longitude]
     */
    function getApproximateCoordinates(lat, lon) {
        console.log('Getting approximate coordinates for', lat, lon);
        const latDD = convertDMSToDD(lat);
        const lonDD = convertDMSToDD(lon);
        
        const approxLat = Math.trunc(latDD);
        const approxLon = Math.trunc(lonDD);
        
        console.log('Approximate coordinates:', approxLat, approxLon);
        return [approxLat, approxLon];
    }	
	
	

	
	
    // Add event listener to the "Upload CUP File" button
    const uploadButton = document.getElementById('upload-cup-button');
    const fileInput = document.getElementById('cup-file-input');
	const fileNameSpan = document.getElementById('cup-file-name');
	
    uploadButton.addEventListener('click', () => {
        fileInput.click();
    });


    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log('File selected:', file.name);
            fileNameSpan.textContent = `${file.name}`; // Set the file name in the span element
            const reader = new FileReader();
            reader.onload = function(e) {
                const data = e.target.result;
                console.log('File content loaded, length:', data.length);
                const pois = parseCUPData(data);
                console.log('Parsed POIs:', pois.length);

                clearMarkers(); // Clear existing markers before adding new ones
                console.log('Existing markers cleared');

                pois.forEach((poi, index) => {
                    try {
                        const lat = convertDMSToDD(poi.lat);
                        const lon = convertDMSToDD(poi.lon);
                        console.log(`Creating marker ${index + 1}/${pois.length} for ${poi.name} at (${lat}, ${lon})`);
                        createMarker(poi, lat, lon);
                        lastPoi = poi; // Update lastPoi with each iteration
                    } catch (error) {
                        console.error(`Error creating marker for ${poi.name}:`, error);
                    }
                });

                console.log('All markers created. Total markers:', markers.length);
                updateVisibleWaypointsCount();
                
                // Recenter map to last POI's approximate location
                if (lastPoi) {
                    console.log('Recentering map to last POI:', lastPoi.name);
                    const [approxLat, approxLon] = getApproximateCoordinates(lastPoi.lat, lastPoi.lon);
                    console.log('Setting view to:', approxLat, approxLon, 'with zoom:', map.getZoom());
                    map.setView([approxLat, approxLon], 6);
                } else {
                    console.log('No POIs processed, map not recentered');
                }
            };
            reader.readAsText(file);
        } else {
            console.log('No file selected');
        }
    });
	
	function fitMapToMarkers() {
		if (markers.length > 0) {
			const group = new L.featureGroup(markers.map(m => m.marker));
			map.fitBounds(group.getBounds());
		}
	}	
	
	
	let pois = [];

	
			
	// Function to parse the CUP file
	function parseCUPData(data) {
		console.log('Parsing CUP data...');
		const lines = data.split('\n');
		const rawHeaders = lines[0].split(',').map(header => header.trim());
		console.log('CUP headers:', rawHeaders);

		const headerMappings = {
			'Title': 'name', 'Name': 'name',
			'Code': 'code',
			'Country': 'country',
			'Latitude': 'lat', 'Lat': 'lat',
			'Longitude': 'lon', 'Lon': 'lon',
			'Elevation': 'elev', 'Elev': 'elev',
			'Style': 'style',
			'Direction': 'rwdir', 'RunwayDirection': 'rwdir',
			'Length': 'rwlen', 'RunwayLength': 'rwlen',
			'Width': 'rwwidth', 'RunwayWidth': 'rwwidth',
			'Frequency': 'freq',
			'Description': 'desc', 'Desc': 'desc'
		};

		const headers = rawHeaders.map(header => headerMappings[header] || header);
		console.log('Mapped headers:', headers);

		pois = [];

		const parseLine = (line) => {
			const result = [];
			let inQuotes = false;
			let currentField = '';
			
			for (let i = 0; i < line.length; i++) {
				if (line[i] === '"') {
					inQuotes = !inQuotes;
				} else if (line[i] === ',' && !inQuotes) {
					result.push(currentField.trim());
					currentField = '';
				} else {
					currentField += line[i];
				}
			}
			result.push(currentField.trim());
			
			return result;
		};

		for (let i = 1; i < lines.length; i++) {
			const line = lines[i].trim();
			if (!line) {
				console.log('Skipping empty line');
				continue;
			}

			const values = parseLine(line);
			if (values.length !== headers.length) {
				console.log(`Warning: Line ${i + 1} has ${values.length} fields, expected ${headers.length}`);
				console.log(`Line: ${line}`);
				// Pad or truncate the values array to match headers length
				while (values.length < headers.length) values.push('');
				values.length = headers.length;
			}

			const poi = {};
			headers.forEach((header, index) => {
				poi[header] = values[index];
			});

			console.log('Parsed POI:', poi);
			if (!poi.name) {
				console.warn('Parsed POI without a name:', poi);
			}

			pois.push(poi);
		}

		console.log('Total POIs parsed:', pois.length);
		updateSearchList(pois); // Update the search list
		return pois;
	}

	// Ensure Awesomplete is correctly initialized
	const poiSearchInput = document.querySelector("#poi-search");
	const awesomplete = new Awesomplete(poiSearchInput, {
		list: [],
		autoFirst: true // Automatically highlight the first item
	});
	console.log("Awesomplete initialized:", awesomplete);

	// Function to update the search list
	function updateSearchList(pois) {
		const poiNames = pois.map(poi => poi.name);
		console.log("Updating search list with POI names:", poiNames);

		awesomplete._list = poiNames;
		console.log("Awesomplete list updated:", awesomplete._list);
	}

	// Add event listener for Awesomplete selection
	poiSearchInput.addEventListener("awesomplete-selectcomplete", function(event) {
		selectionMade = true;
		const selectedName = event.text.value;
		console.log("Selected POI from autocomplete:", selectedName);

		// Find the corresponding POI
		const selectedPoi = pois.find(poi => poi.name === selectedName);
		if (selectedPoi) {
			console.log("Selected POI data:", selectedPoi);

			// Update map view and details
			const lat = convertDMSToDD(selectedPoi.lat);
			const lon = convertDMSToDD(selectedPoi.lon);
			console.log(`Setting map view to [${lat}, ${lon}]`);
			map.setView([lat, lon], 10); // Adjust zoom level as needed

			// Simulate a click on the marker
			const markerObj = markers.find(m => m.poi.name === selectedName);
			if (markerObj) {
				console.log("Found marker for selected POI:", markerObj);
				markerObj.marker.fire('click');
			} else {
				console.error("No marker found for selected POI:", selectedName);
			}

			// Clear the search box
			event.target.value = '';
		} else {
			console.error("No POI found with the selected name:", selectedName);
			console.log("Available POIs:", pois);
		}
	});
	
	
	// Add event listener for Enter key to select the highlighted entry or the first entry
	document.querySelector("#poi-search").addEventListener("keydown", function(event) {
		if (event.key === "Enter") {
			event.preventDefault(); // Prevent form submission if applicable
			
			console.log("Enter key pressed");
			console.log("Awesomplete index:", awesomplete.index);
			console.log("Awesomplete suggestions length:", awesomplete.ul.childNodes.length);
			
			// Only proceed if a selection hasn't been made already
			if (!selectionMade) {
				if (awesomplete.ul.childNodes.length > 0 && awesomplete.index > -1) {
					console.log("Selecting highlighted suggestion:", awesomplete.ul.childNodes[awesomplete.index].textContent);
					awesomplete.select();
				} else if (awesomplete.ul.childNodes.length > 0) {
					console.log("Selecting first suggestion:", awesomplete.ul.childNodes[0].textContent);
					awesomplete.select(awesomplete.ul.childNodes[0]);
				}
			}
			selectionMade = false; // Reset for next selection
		}
	});
	
	// Add event listener to log arrow key navigation
	document.querySelector("#poi-search").addEventListener("awesomplete-highlight", function(event) {
		console.log("Highlighted suggestion index:", awesomplete.index);
		if (awesomplete.index > -1) {
			console.log("Highlighted suggestion:", awesomplete.ul.childNodes[awesomplete.index].textContent);
		}
		selectionMade = false; // Reset selection flag on new highlight
	});

	
	
	
	
	
	
	

    function clearMarkers() {
        markers.forEach(({ marker }) => {
            map.removeLayer(marker);
        });
        markers = [];
    }



	const gridSize = 35; // Configurable pixel value for the grid to render not all markers
	const renderThreshold = 100; // Configurable threshold for total number of markers to render
	const gridLogicZoomLevel = 9; // render all at zoom higher than this




	function updateAllMarkers() {
		const bounds = map.getBounds();
		const zoomLevel = map.getZoom();
		const iconSize = ICON_SIZES[zoomLevel] || ICON_SIZES[10]; // Default to size for zoom level 10 if undefined
		let redrawCount = 0; // Counter for redrawn markers

		const markerPositions = []; // Array to store marker pixel positions
		const grid = {}; // Object to track occupied grid cells

		markers.forEach(({ marker, poi }) => {
			const lat = convertDMSToDD(poi.lat);
			const lon = convertDMSToDD(poi.lon);
			const latLng = L.latLng(lat, lon);

			if (bounds.contains(latLng)) {
				const pixelPosition = map.latLngToLayerPoint(latLng);
				markerPositions.push({ pixelPosition, marker, poi });
			} else {
				map.removeLayer(marker); // Remove the marker from the map if out of bounds
			}
		});

		if (markerPositions.length <= renderThreshold) {
			markerPositions.forEach(({ marker, poi }) => {
				updateMarkerIcon(marker, poi, iconSize);
				marker.addTo(map);
				redrawCount++;
			});
		} else {
			markerPositions.forEach(({ pixelPosition, marker, poi }) => {
				const gridX = Math.floor(pixelPosition.x / gridSize);
				const gridY = Math.floor(pixelPosition.y / gridSize);
				const gridKey = `${gridX},${gridY}`;

				if (!grid[gridKey]) {
					updateMarkerIcon(marker, poi, iconSize);
					marker.addTo(map); // Add the marker to the map if within bounds
					redrawCount++;
					grid[gridKey] = true; // Mark this grid cell as occupied
				} else {
					map.removeLayer(marker); // Remove the marker from the map if out of bounds
				}
			});
		}

		console.log(`Markers redrawn: ${redrawCount}`);
	}


	// Ensure to call updateAllMarkers when the map zoom or move events occur
	map.on('zoomend', function() {
		console.log(`Zoom level changed: ${map.getZoom()}`);
		updateAllMarkers();
		handleAirspaceLabelsVisibility(map.getZoom());
		adjustCircles();
	});

	const visibleWaypointsSpan = document.getElementById('visible-waypoints');

	function updateVisibleWaypointsCount() {
		if (visibleWaypointsSpan) {
			visibleWaypointsSpan.textContent = `Number of waypoints: ${markers.length}`;
		} else {
			console.error('visible-waypoints element not found');
		}
	}








	
	let selectedPoi = null; // Track the currently selected POI


	// Function to create a marker
	function createMarker(poi, lat, lon) {
		console.log(`Creating marker for ${poi.name} at ${lat}, ${lon}`);
		const zoomLevel = map.getZoom();
		const iconSize = ICON_SIZES[zoomLevel] || ICON_SIZES[10];
		const iconUrl = iconSettings[poi.style] || 'icons/default_icon.svg';
		const textSize = TEXT_SIZES[zoomLevel].size;
		let textVisible = TEXT_SIZES[zoomLevel].visible ? 'visible' : 'hidden';

		// Always show the label if this POI is selected
		if (selectedPoi && selectedPoi.name === poi.name) {
			textVisible = 'visible';
		}

		const customIcon = L.divIcon({
			html: `
				<div style="position: relative;">
					<img src="${iconUrl}" style="width: 100%; height: 100%; transform: rotate(${parseFloat(poi.rwdir) - 45}deg); transform-origin: center;">
					<div style="position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); border-radius: 5px; padding: 2px 5px; white-space: nowrap; text-align: center; font-size: ${textSize}; visibility: ${textVisible}; color: white; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000; border: ${selectedPoi && selectedPoi.name === poi.name ? '2px solid red' : 'none'}; border-radius: 5px;">
						${poi.name}
					</div>
				</div>
			`,
			className: '',
			iconSize: iconSize,
			iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
			popupAnchor: [0, -iconSize[1] / 2]
		});

		const marker = L.marker([lat, lon], { icon: customIcon }).addTo(map);
		markers.push({ marker, poi });

		marker.on('click', () => {
			console.log('Marker clicked:', poi.name);
			selectedPoi = poi; // Update the selected POI
			updateAllMarkers(); // Update all markers to reflect the selection
			updatePoiDetails(poi);
		});
	}

	function updateMarkerIcon(marker, poi, iconSize) {
		const zoomLevel = map.getZoom();
		const iconUrl = iconSettings[poi.style] || 'icons/default_icon.svg';
		const textSize = TEXT_SIZES[zoomLevel].size;
		let textVisible = TEXT_SIZES[zoomLevel].visible ? 'visible' : 'hidden';

		// Always show the label if this POI is selected
		if (selectedPoi && selectedPoi.name === poi.name) {
			textVisible = 'visible';
		}

		// Hide labels at zoom levels 8 and below except for the selected POI
		if (zoomLevel < 9 && (!selectedPoi || selectedPoi.name !== poi.name)) {
			textVisible = 'hidden';
		}

		const customIcon = L.divIcon({
			html: `
				<div style="position: relative;">
					<img src="${iconUrl}" style="width: 100%; height: 100%; transform: rotate(${parseFloat(poi.rwdir) - 45}deg); transform-origin: center;">
					<div style="position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); border-radius: 5px; padding: 2px 5px; white-space: nowrap; text-align: center; font-size: ${textSize}; visibility: ${textVisible}; color: white; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000; border: ${selectedPoi && selectedPoi.name === poi.name ? '2px solid red' : 'none'}; border-radius: 5px;">
						${poi.name}
					</div>
				</div>
			`,
			className: '',
			iconSize: iconSize,
			iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
			popupAnchor: [0, -iconSize[1] / 2]
		});

		marker.setIcon(customIcon);
	}

	function updatePoiDetails(poi) {
		const unit = document.getElementById('units').value;
		console.log('Current unit:', unit);

		// Helper function to safely convert and format values
		function convertValue(value, unit, conversionFunc) {
			if (typeof value === 'string') {
				const numericValue = parseFloat(value);
				if (!isNaN(numericValue)) {
					// Remove any existing unit
					let cleanedValue = value.replace(/[^\d.-]/g, '');
					const cleanedNumericValue = parseFloat(cleanedValue);

					if (unit === 'imperial') {
						if (value.endsWith('m')) {
							const result = conversionFunc(cleanedNumericValue);
							return result;
						} else if (value.endsWith('ft')) {
							const result = cleanedNumericValue + ' ft';
							return result;
						}
					} else if (unit === 'metric') {
						if (value.endsWith('ft')) {
							const result = conversionFunc(cleanedNumericValue);
							return result;
						} else if (value.endsWith('m')) {
							const result = cleanedNumericValue + ' m';
							return result;
						}
					}
				}
			}
			return value || ''; // Return original value or empty string if undefined/invalid
		}

		// Convert values
		let elev = convertValue(poi.elev, unit, unit === 'imperial' ? metersToFeet : feetToMeters);
		let rwlen = convertValue(poi.rwlen, unit, unit === 'imperial' ? metersToFeet : feetToMeters);
		let rwwidth = convertValue(poi.rwwidth, unit, unit === 'imperial' ? metersToFeet : feetToMeters);

		console.log(`Displaying details for ${poi.name || 'Unknown'}:`, { elev, rwlen, rwwidth });

		// Helper function to safely update DOM elements
		function updateElement(id, value) {
			const element = document.getElementById(id);
			if (element) {
				element.textContent = value || '';
			} else {
				console.warn(`Element with id '${id}' not found`);
			}
		}

		// Update DOM elements
		updateElement('poi-name', poi.name);
		updateElement('poi-code', poi.code);
		updateElement('poi-country', poi.country);
		updateElement('poi-lat', poi.lat);
		updateElement('poi-lon', poi.lon);
		updateElement('poi-elev', elev);

		// Use the mapping to display the style
		const styleValue = poi.style || '';
		const styleDescription = styleMapping[styleValue] || "Unknown";
		updateElement('poi-style', `${styleValue} - ${styleDescription}`);

		updateElement('poi-rwdir', poi.rwdir ? `${poi.rwdir}°` : '');
		updateElement('poi-rwlen', rwlen);
		updateElement('poi-rwwidth', rwwidth);
		updateElement('poi-freq', poi.freq || '');
		updateElement('poi-desc', poi.desc);
	}

	// Add event listener for unit change to update the details if needed
	document.getElementById('units').addEventListener('change', function() {
		console.log('Unit changed:', document.getElementById('units').value);
		if (currentPoi) {
			updatePoiDetails(currentPoi);
		}
	});
	
	
 



    const airspaceLayers = {
        classB: L.layerGroup(),
        classC: L.layerGroup(),
        classD: L.layerGroup(),
        classQ: L.layerGroup(),
        classR: L.layerGroup()
    };

    let airspaceLabels = [];
    let measurementCircles = {
        '15m': null,
        '18m': null
    };

	let stateBordersLayer;

	function loadGeoJsonData() {
		// Load airspace GeoJSON data
		fetch('files/airspaces.geojson')
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok ' + response.statusText);
				}
				console.log('Airspace response:', response);
				return response.json();
			})
			.then(data => {
				console.log('Airspace data:', data);
				L.geoJSON(data, {
					style: feature => {
						switch (feature.properties.CLASS) {
							case 'B': return { color: '#2979B8', weight: 2, fillOpacity: 0.1 };
							case 'C': return { color: '#903B62', weight: 2, fillOpacity: 0.1 };
							case 'D': return { color: '#1D4473', weight: 2, dashArray: '5, 5', fillOpacity: 0.1 };
							case 'Q': return { color: '#903B62', weight: 2, dashArray: '10, 10', fillOpacity: 0.1 };
							case 'R': return { color: '#2979B8', weight: 2, dashArray: '10, 10', fillOpacity: 0.1 };
							default: return { color: '#2979B8', weight: 1, fillOpacity: 0.1 };
						}
					},
					onEachFeature: (feature, layer) => {
						if (feature.properties && feature.properties.NAME) {
							layer.bindPopup(`<strong>${feature.properties.NAME}</strong><br>${feature.properties.CEILING} to ${feature.properties.FLOOR}`);
						}
						if (feature.geometry.type === "Polygon" || feature.geometry.type === "MultiPolygon") {
							const bounds = layer.getBounds();
							const center = bounds.getCenter();

							switch (feature.properties.CLASS) {
								case 'B':
									airspaceLayers.classB.addLayer(layer);
									break;
								case 'C':
									airspaceLayers.classC.addLayer(layer);
									break;
								case 'D':
									airspaceLayers.classD.addLayer(layer);
									break;
								case 'Q':
									airspaceLayers.classQ.addLayer(layer);
									break;
								case 'R':
									airspaceLayers.classR.addLayer(layer);
									break;
								default:
									break;
							}
						}
					}
				});
			})
			.catch(error => console.error('Error loading airspace data:', error));
	}
			
		// Load state borders GeoJSON data
	function loadStateBorders() {
		fetch('files/us_states.geojson')
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok ' + response.statusText);
				}
				console.log('State borders response:', response);
				return response.json();
			})
			.then(data => {
				console.log('State borders data:', data);
				stateBordersLayer = L.geoJSON(data, {
					style: {
						color: 'white',
						weight: 2,
						fillOpacity: 0 // Ensure no fill
					}
				}).addTo(map);
			})
			.catch(error => console.error('Error loading state borders data:', error));
	}

	function removeStateBorders() {
		if (stateBordersLayer) {
			map.removeLayer(stateBordersLayer);
		}
	}

    loadGeoJsonData();

    // Airspace control with checkboxes
    const collapsibleControl = L.control({ position: 'topleft' });

    collapsibleControl.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'collapsible-control');
        div.innerHTML = `
            <h4><strong>Overlay</strong></h4>
            <div class="collapsible-content">
                <h4><strong>Airspaces</strong></h4>
                <label><input type="checkbox" id="classB"> Class B</label>
                <label><input type="checkbox" id="classC"> Class C</label>
                <label><input type="checkbox" id="classD"> Class D</label>
                <label><input type="checkbox" id="classQ"> DZ/MOA</label>
                <label><input type="checkbox" id="classR"> Restricted</label>
                <h4><strong>Measurement</strong></h4>
                <label><input type="checkbox" id="circle15m"> 15m</label>
                <label><input type="checkbox" id="circle18m"> 18m</label>
				<label><input type="checkbox" id="circle21m"> 21m</label>
				<h4><strong>Borders</strong></h4>
				<label><input type="checkbox" id="borders-states"> US States</label>
            </div>
        `;
        return div;
    };

    collapsibleControl.addTo(map);

	const content = document.querySelector('.collapsible-content');
	content.style.display = 'none'; // Set initial state
	
	
	document.querySelector('.collapsible-control h4').addEventListener('click', function() {
		content.style.display = content.style.display === 'none' ? 'block' : 'none';
	});

    document.getElementById('classB').addEventListener('change', function() {
        if (this.checked) {
            map.addLayer(airspaceLayers.classB);
        } else {
            map.removeLayer(airspaceLayers.classB);
        }
    });

    document.getElementById('classC').addEventListener('change', function() {
        if (this.checked) {
            map.addLayer(airspaceLayers.classC);
        } else {
            map.removeLayer(airspaceLayers.classC);
        }
    });

    document.getElementById('classD').addEventListener('change', function() {
        if (this.checked) {
            map.addLayer(airspaceLayers.classD);
        } else {
            map.removeLayer(airspaceLayers.classD);
        }
    });

    document.getElementById('classQ').addEventListener('change', function() {
        if (this.checked) {
            map.addLayer(airspaceLayers.classQ);
        } else {
            map.removeLayer(airspaceLayers.classQ);
        }
    });

    document.getElementById('classR').addEventListener('change', function() {
        if (this.checked) {
            map.addLayer(airspaceLayers.classR);
        } else {
            map.removeLayer(airspaceLayers.classR);
        }
    });

    function handleAirspaceLabelsVisibility(zoomLevel) {
        if (zoomLevel < 9) {
            airspaceLabels.forEach(label => map.removeLayer(label));
        } else {
            airspaceLabels.forEach(label => map.addLayer(label));
        }
    }



    document.getElementById('circle15m').addEventListener('change', function() {
        if (this.checked) {
            drawCircle('15m', 7.5);
        } else {
            removeCircle('15m');
        }
    });

    document.getElementById('circle18m').addEventListener('change', function() {
        if (this.checked) {
            drawCircle('18m', 9);
        } else {
            removeCircle('18m');
        }
    });
	
    document.getElementById('circle21m').addEventListener('change', function() {
        if (this.checked) {
            drawCircle('21m', 10.5); // New 21m circle
        } else {
            removeCircle('21m');
        }
    });
	
	document.getElementById('borders-states').addEventListener('change', function() {
		if (this.checked) {
			loadStateBorders();
		} else {
			removeStateBorders();
		}
	});	
	
	
	

    function drawCircle(id, radius) {
        const center = map.getCenter();
        const circle = L.circle(center, {
            radius: radius,
            color: 'white',
            weight: 3,
            opacity: 0.7
        }).addTo(map);
        const label = L.marker(center, {
            icon: L.divIcon({
                className: 'circle-label',
                html: `<div style="font-size: 14px; color: white; text-align: center;">${id}</div>`,
                iconSize: [30, 15]
            })
        }).addTo(map);
        measurementCircles[id] = { circle, label };
    }

    function removeCircle(id) {
        if (measurementCircles[id]) {
            map.removeLayer(measurementCircles[id].circle);
            map.removeLayer(measurementCircles[id].label);
            measurementCircles[id] = null;
        }
    }

    map.on('moveend', function() {
        adjustCircles();
		updateAllMarkers();
		
    });

    function adjustCircles() {
        Object.keys(measurementCircles).forEach(id => {
            const measurement = measurementCircles[id];
            if (measurement) {
                const center = map.getCenter();
                measurement.circle.setLatLng(center);
                measurement.label.setLatLng(center);
            }
        });
    }
});
